package com.example.EduManager.service;

import com.example.EduManager.Enum.ErrorCode;
import com.example.EduManager.dto.request.AuthenticationRequest;
import com.example.EduManager.dto.request.IntrospectRequest;
import com.example.EduManager.dto.request.LogoutRequest;
import com.example.EduManager.dto.request.RefreshRequest;
import com.example.EduManager.dto.response.AuthenticationResponse;
import com.example.EduManager.dto.response.IntrospectResponse;
import com.example.EduManager.entity.InvalidatedToken;
import com.example.EduManager.entity.User;
import com.example.EduManager.exception.AppException;
import com.example.EduManager.repository.InvalidatedTokenRepository;
import com.example.EduManager.repository.UserRepository;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.StringJoiner;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthenticationService {

    final UserRepository userRepository;
    final PasswordEncoder encoder;
    final InvalidatedTokenRepository invalidatedTokenRepository;

    @Value("${security.jwt.signer-key}")
    private String signerKey;

    @Value(("${security.jwt.valid-duration}"))
    protected long VALID_DURATION;

    @Value("${security.jwt.refresh-duration}")
    protected long REFRESH_DURATION;

    public AuthenticationResponse authenticated(AuthenticationRequest request) {
        log.info("Attempting to authenticate user: {}", request.getEmail());
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // Fetch roles và permissions
        Hibernate.initialize(user.getRoles());
        user.getRoles().forEach(role -> Hibernate.initialize(role.getPermissions()));

        log.info("User {} has roles: {}", user.getEmail(), user.getRoles());
        user.getRoles().forEach(role ->
                log.info("Role {} has permissions: {}", role.getName(), role.getPermissions())
        );

        log.info("Verifying password for user {}", user.getEmail());
        boolean authenticated = encoder.matches(request.getPassword(), user.getPassword());
        if (!authenticated) {
            log.error("Authentication failed for user {}: invalid password", user.getEmail());
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        log.info("Generating token for user {}", user.getEmail());
        String token;
        try {
            token = generateToken(user);
        } catch (Exception e) {
            log.error("Error generating token for user {}: {}", user.getEmail(), e.getMessage(), e);
            throw new AppException(ErrorCode.TOEKEN_GENERATE_FAILD);
        }

        if (token == null || token.isEmpty()) {
            log.error("Generated token is empty for user {}", user.getEmail());
            throw new AppException(ErrorCode.TOEKEN_GENERATE_FAILD);
        }

        log.info("Successfully authenticated user {} with token: {}", user.getEmail(), token);
        return AuthenticationResponse.builder()
                .authenticated(true)
                .token(token)
                .build();
    }

    // Hàm này có tác dụng là kiểm tra xem token có hợp lệ k
    public IntrospectResponse introspects(IntrospectRequest request) throws JOSEException, ParseException {
        var token = request.getToken();
        boolean isValid = true;
        try {
            verifyToken(token, false);
        }catch (AppException e){
            isValid = false;
        }
        // Nếu token hợp lệ thì trả về true
        return IntrospectResponse.builder()
                .valid(isValid)
                .build();
    }


    // Hàm này có tác dụng là kiểm tra xem token có hợp lệ k và trả về thông tin token
    private SignedJWT verifyToken(String token, boolean isRefresh) throws JOSEException, ParseException {
        JWSVerifier verifier = new MACVerifier(signerKey.getBytes());

        // Kiểm tra token có hợp lệ k
        SignedJWT signedJWT = SignedJWT.parse(token);

        // Kiểm tra cái token có còn hạn k
        // Nếu là refresh token thì thời gian hết hạn sẽ là thời gian tạo token cộng vs REFRESH_DURATION
        Date expirationTime = (isRefresh)
                ? new Date(signedJWT.getJWTClaimsSet().getIssueTime().toInstant()
                        .plus(REFRESH_DURATION, ChronoUnit.SECONDS).toEpochMilli())
                // Nếu là access token thì thời gian hết hạn sẽ là thời gian tạo token
                : signedJWT.getJWTClaimsSet().getExpirationTime();

        // Kiểm tra chữ kí của token có hợp lệ k
        var verified = signedJWT.verify(verifier);

        if(!verified || expirationTime.before(new Date())){
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        // Kiểm tra cái jwtID trong token có tồn tại trong db k vì trong db là các token được logout
        if(invalidatedTokenRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID())){
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        return signedJWT;
    }


    public void logout(LogoutRequest request) throws ParseException, JOSEException {
        // Lấy token được gửi lên
        try{
            var signToken =  verifyToken(request.getToken(), true);
            // Lấy cái jwtID trong token ra
            String jwtId = signToken.getJWTClaimsSet().getJWTID();

            // Lấy cái expiryTime trong token ra
            Date expiryTime = signToken.getJWTClaimsSet().getExpirationTime();

            InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                    .id(jwtId)
                    .expiryTime(expiryTime)
                    .build();
            invalidatedTokenRepository.save(invalidatedToken);
        }catch (AppException e){
            log.info("Token already expired");
        }
    }

    public AuthenticationResponse refreshToken(RefreshRequest request)
            throws ParseException, JOSEException {
        // Lấy token được gửi lên và kiểm tra xem token có hợp lệ k
        var signedJWT = verifyToken(request.getToken(),true);

        var jwtId = signedJWT.getJWTClaimsSet().getJWTID();

        var expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();

        InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                .id(jwtId)
                .expiryTime(expiryTime)
                .build();
        invalidatedTokenRepository.save(invalidatedToken);

        // Sau khi token cũ đã được xem là logout thì giờ sẽ tạo ra 1 cái token mới

        // Lấy cái email trong token ra
        var userid = signedJWT.getJWTClaimsSet().getSubject();

        var user = userRepository.findById(userid)
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));

        var token = generateToken(user);

        return AuthenticationResponse.builder()
                .authenticated(true)
                .token(token)
                .build();
    }

    private String generateToken(User user){
        // Xác định thuật toán kí
        JWSHeader jwsHeader = new JWSHeader(JWSAlgorithm.HS512);
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getId())
                .issuer("com.example")
                // Thời gian tạo token
                .issueTime(new Date())
                // Tạo 1 thời gian có instant.now là thời gian hiện tại cộng vs VALID_DURATION đơn vị là giây và chuyển thành epoch
                .expirationTime(new Date(Instant.now().plus(VALID_DURATION, ChronoUnit.SECONDS).toEpochMilli()))
                .claim("scope", buildScope(user))
                // Thêm 1 cái claim nữa là jwtID có tác dụng là để phân biệt các token khác nhau
                .jwtID(UUID.randomUUID().toString())
                .build();
        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(jwsHeader,payload);

        try{
            jwsObject.sign(new MACSigner(signerKey.getBytes()));
            return jwsObject.serialize();
        }catch (JOSEException exception){
            log.error("Cannot create token");
            throw new RuntimeException(exception);
        }
    }

    private String buildScope(User user) {
        StringJoiner stringJoiner = new StringJoiner(" ");

        if (CollectionUtils.isEmpty(user.getRoles())) {
            log.warn("User has no roles assigned");
            return "";
        }

        user.getRoles().forEach(role -> {
            stringJoiner.add("ROLE_" + role.getName());
            if (CollectionUtils.isEmpty(role.getPermissions())) {
                log.warn("Role {} has no permissions assigned", role.getName());
            } else {
                role.getPermissions().forEach(permission -> stringJoiner.add(permission.getName()));
            }
        });

        String scope = stringJoiner.toString();
        log.info("Generated scope: {}", scope);
        return scope;
    }
}
