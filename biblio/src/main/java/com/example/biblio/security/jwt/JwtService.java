package com.example.biblio.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {
    private static final String secretKey = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";

    public String extractUserEmail(String token) {

        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver){
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }


    private Claims extractAllClaims(String token){
        return Jwts.
                parserBuilder().
                setSigningKey(getSigningKey()).
                build().
                parseClaimsJws(token).
                getBody();
    }

    public String generateToken(UserDetails userDetails){
        return generateToken(new HashMap<>(), userDetails);
    }


    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails){
        Map<String, Object> claims = new HashMap<>();
        // Add "role" information to the claims
        String role = ""; // Placeholder for role value
        // Set role based on user role from userDetails
        if (userDetails.getAuthorities().contains(new SimpleGrantedAuthority("ADMIN"))) {
            role = "ADMIN";
        } else if (userDetails.getAuthorities().contains(new SimpleGrantedAuthority("CLIENT"))) {
            role = "CLIENT";
        } else if (userDetails.getAuthorities().contains(new SimpleGrantedAuthority("CLIENTA"))) {
        role = "CLIENTA";
        }
        claims.put("role", role);
        claims.putAll(extraClaims);
        return Jwts.builder().setClaims(claims).setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 24))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }
    Boolean isTokenValid(String token, UserDetails userDetails){
        final String userEmail = extractUserEmail(token);
        return (userEmail.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private Boolean isTokenExpired(String token){
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }



    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
