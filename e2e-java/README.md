# Java / Selenium / Cucumber / TestNG e2e suite

A second end-to-end suite covering the same scenarios as `../e2e` (Playwright/JS),
written with the Java stack instead: Selenium WebDriver, Cucumber (Gherkin),
and TestNG as the runner.

## Stack

- **Selenium WebDriver** (Chrome, driver managed automatically by WebDriverManager)
- **Cucumber-JVM** for Gherkin feature files + step definitions
- **TestNG** as the test runner (`AbstractTestNGCucumberTests`)
- **Page Object Model** (`src/test/java/.../support/pages`) — step definitions
  never touch Selenium locators directly, they call page object methods
- Every locator is `[data-testid='...']`, matching the same attributes the
  Playwright suite and the app's own React components use

## A note on CI

This suite is noticeably heavier than the Playwright one: Cucumber's
`@Before`/`@After` hooks launch and tear down a **fresh Chrome session for
every scenario** (18 of them), vs. Playwright reusing a single browser
context. On a shared 2-core GitHub-hosted runner that's enough load to
occasionally starve a scenario of CPU mid-wait. Two mitigations are in
place for that:

- `Config.DEFAULT_TIMEOUT_SECONDS` defaults to 20s (CI passes 25s via
  `-Dtimeout.seconds=25`), up from a locally-fine 10s.
- `pom.xml`'s Surefire config sets `rerunFailingTestsCount=2` - a scenario
  that fails is retried before being reported as failed. This is standard
  practice for Selenium suites on CI and doesn't mask real bugs: a
  genuinely broken scenario (like the app's own seeded bugs) still fails
  deterministically on every retry.

## Prerequisites

- JDK 17+ (this repo was built/tested against JDK 21)
- Maven 3.9+
- Google Chrome installed locally

## Running

Start the backend and frontend dev servers first (from the repo root):

```bash
cd backend && npm install && npm run dev
```
```bash
cd frontend && npm install && npm run dev
```

Then, in a third terminal:

```bash
cd e2e-java
mvn test
```

By default Chrome runs **headed** (visible) so you can watch the suite drive
the browser. Run headless instead with:

```bash
mvn test -Dheadless=true
```

Other overridable properties (see `support/Config.java`):

| Property | Default | Purpose |
|---|---|---|
| `frontend.url` | `http://localhost:5173` | Where the React app is served |
| `api.url` | `http://localhost:4000/api` | Backend API base URL |
| `headless` | `false` | Run Chrome headless |

## Reports

- Cucumber HTML report: `target/cucumber-report.html`
- Cucumber JSON report: `target/cucumber-report.json`
- TestNG/Surefire XML: `target/surefire-reports/`
- Failed scenarios get a screenshot embedded automatically (see `stepdefinitions/Hooks.java`)

## Project layout

```
e2e-java/
├── pom.xml
├── testng.xml                          TestNG suite pointing at the Cucumber runner
└── src/test/
    ├── java/com/bankofhamedsdet/e2e/
    │   ├── runners/TestNGRunner.java    @CucumberOptions + AbstractTestNGCucumberTests
    │   ├── stepdefinitions/             Given/When/Then glue code
    │   └── support/
    │       ├── Config.java              base URLs, timeouts, headless flag
    │       ├── DriverFactory.java        ThreadLocal WebDriver lifecycle
    │       ├── ApiClient.java            calls POST /api/test/reset directly over HTTP
    │       └── pages/                    Page Object Model (LoginPage, DashboardPage, TransferPage)
    └── resources/features/
        ├── login.feature
        └── transfer.feature
```

## Extending this suite

Same idea as the Playwright suite: this covers login + transfer only. Good
next scenarios to add yourself (see `../ANSWER_KEY.md` for the seeded bugs):
bill pay, account search/pagination (including the seeded pagination
off-by-one and case-sensitive search bugs), registration, and session
expiry.
