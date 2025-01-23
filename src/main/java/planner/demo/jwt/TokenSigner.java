package planner.demo.jwt;

public interface TokenSigner {
    String signToken(String token);
}
