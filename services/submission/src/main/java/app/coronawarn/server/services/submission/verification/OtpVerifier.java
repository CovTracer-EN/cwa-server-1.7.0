package app.coronawarn.server.services.submission.verification;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.HashMap;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;

/**
 * The OtpVerifier performs the verification of submission OTPs.
 */
@Service
public class OtpVerifier {

  @Value("${otp.url}")
  private String url;

  @Value("${otp.token}")
  private String token;

  /**
   * Verifies the specified OTP. Returns {@literal true} if the specified OTP is valid, {@literal false} otherwise.
   *
   * @param otpString Submission Authorization OTP
   * @return {@literal true} if the specified OTP is valid, {@literal false} otherwise.
   * @throws RestClientException if status code is neither 2xx nor 4xx
   */
  public boolean verifyOtp(String otpString) throws IOException, InterruptedException {
    HashMap<String, String> values = new HashMap<>() {
      {
        put("code", otpString);
      }
    };

    ObjectMapper objectMapper = new ObjectMapper();
    String requestBody = objectMapper.writeValueAsString(values);

    HttpClient client = HttpClient.newHttpClient();
    HttpRequest request = HttpRequest.newBuilder()
        .uri(URI.create(url))
        .setHeader("Token", token)
        .setHeader("Content-Type", "application/json")
        .POST(HttpRequest.BodyPublishers.ofString(requestBody))
        .build();

    HttpResponse<String> response = client.send(request,
        HttpResponse.BodyHandlers.ofString());

    return response.body().contains("true");
  }
}
