package com.bankofhamedsdet.e2e.support;

public final class Config {

    public static final String FRONTEND_URL = System.getProperty("frontend.url", "http://localhost:5173");
    public static final String API_BASE_URL = System.getProperty("api.url", "http://localhost:4000/api");
    public static final boolean HEADLESS = Boolean.parseBoolean(System.getProperty("headless", "false"));
    // CI runners are shared 2-core boxes and spin up a fresh Chrome per
    // scenario, so 10s (fine locally) isn't always enough there.
    public static final long DEFAULT_TIMEOUT_SECONDS = Long.parseLong(System.getProperty("timeout.seconds", "20"));

    private Config() {
    }
}
