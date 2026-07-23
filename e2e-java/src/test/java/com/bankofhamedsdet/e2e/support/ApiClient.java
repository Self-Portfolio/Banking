package com.bankofhamedsdet.e2e.support;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

/** Talks to the backend's test-only convenience endpoints directly over HTTP, no browser involved. */
public final class ApiClient {

    private static final HttpClient CLIENT = HttpClient.newHttpClient();

    private ApiClient() {
    }

    public static void resetDemoData() {
        try {
            HttpRequest request = HttpRequest.newBuilder(URI.create(Config.API_BASE_URL + "/test/reset"))
                    .POST(HttpRequest.BodyPublishers.noBody())
                    .build();
            HttpResponse<Void> response = CLIENT.send(request, HttpResponse.BodyHandlers.discarding());
            if (response.statusCode() != 200) {
                throw new IllegalStateException("Reset endpoint returned status " + response.statusCode());
            }
        } catch (IOException | InterruptedException e) {
            throw new IllegalStateException("Could not reach backend at " + Config.API_BASE_URL
                    + " - is `npm run dev` running in backend/?", e);
        }
    }
}
