import { expect } from "../utils/custom-expect";
import { test } from "../utils/fixtures";

const testCases = [
  {
    username: "d".repeat(2),
    expectedError: "is too short (minimum is 3 characters)",
  },
  { username: "d".repeat(3), expectedError: null },
  { username: "d".repeat(20), expectedError: null },
  {
    username: "d".repeat(21),
    expectedError: "is too long (maximum is 20 characters)",
  },
];

test.describe("Username length validation", () => {
  testCases.forEach(({ username, expectedError }) => {
    test(`username with ${username.length} chars ${
      expectedError ? "is rejected" : "passes username validation"
    }`, async ({ api }) => {
      const response = await api
        .path("/users")
        .body({ user: { email: "d", password: "d", username } })
        .clearAuth()
        .postRequest(422);

      if (expectedError) {
        expect(response.errors.username[0]).shouldEqual(expectedError);
      } else {
        // email/password are intentionally invalid, so the request still returns 422.
        // We only assert that the username field itself raised no error.
        expect(response.errors).not.toHaveProperty("username");
      }
    });
  });
});
