import http from "k6/http";
import { sleep, check } from "k6";

export const options = {
  stages: [
    { duration: "30s", target: 50 }, // Ramp up to 50 users over 30 seconds
    { duration: "1m", target: 50 }, // Stay at 50 users for 1 minute
    { duration: "10s", target: 0 }, // Ramp down to 0 users
  ],
};

export default function () {
  const res = http.get("http://host.docker.internal:8000/api/products");

  check(res, {
    "status is 200": (r) => r.status === 200,
    "response time < 500ms": (r) => r.timings.duration < 500,
    "has data": (r) => r.body.includes("data"), // Basic check for JSON response
  });

  sleep(1);
}
