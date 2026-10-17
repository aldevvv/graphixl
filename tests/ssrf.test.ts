import test from "node:test";
import assert from "node:assert/strict";
import { isPrivateOrBlockedIp, validateUrlSyntax, SsrfSecurityError } from "../lib/security/ssrf";

test("SSRF: rejects private IPv4 subnets", () => {
  assert.equal(isPrivateOrBlockedIp("10.0.0.1"), true);
  assert.equal(isPrivateOrBlockedIp("10.254.0.1"), true);
  assert.equal(isPrivateOrBlockedIp("172.16.0.1"), true);
  assert.equal(isPrivateOrBlockedIp("172.31.255.255"), true);
  assert.equal(isPrivateOrBlockedIp("192.168.1.1"), true);
  assert.equal(isPrivateOrBlockedIp("192.168.0.254"), true);
});

test("SSRF: rejects loopback addresses", () => {
  assert.equal(isPrivateOrBlockedIp("127.0.0.1"), true);
  assert.equal(isPrivateOrBlockedIp("127.1.2.3"), true);
  assert.equal(isPrivateOrBlockedIp("::1"), true);
});

test("SSRF: rejects link-local and cloud metadata addresses", () => {
  assert.equal(isPrivateOrBlockedIp("169.254.169.254"), true);
  assert.equal(isPrivateOrBlockedIp("169.254.1.1"), true);
  assert.equal(isPrivateOrBlockedIp("fe80::1"), true);
  assert.equal(isPrivateOrBlockedIp("100.100.100.200"), true);
});

test("SSRF: rejects IPv6 unique local and mapped addresses", () => {
  assert.equal(isPrivateOrBlockedIp("fc00::1"), true);
  assert.equal(isPrivateOrBlockedIp("fd12:3456:789a::1"), true);
  assert.equal(isPrivateOrBlockedIp("::ffff:127.0.0.1"), true);
  assert.equal(isPrivateOrBlockedIp("::ffff:10.0.0.1"), true);
  assert.equal(isPrivateOrBlockedIp("64:ff9b::7f00:0001"), true); // NAT64 loopback
  assert.equal(isPrivateOrBlockedIp("64:ff9b::a00:0001"), true); // NAT64 private 10.0.0.1
});

test("SSRF: accepts valid public IP addresses", () => {
  assert.equal(isPrivateOrBlockedIp("8.8.8.8"), false);
  assert.equal(isPrivateOrBlockedIp("1.1.1.1"), false);
  assert.equal(isPrivateOrBlockedIp("93.184.216.34"), false);
  assert.equal(isPrivateOrBlockedIp("64:ff9b::d8c6:4f01"), false); // NAT64 public 216.198.79.1
});

test("URL syntax validation: accepts valid HTTP and HTTPS URLs", () => {
  const u1 = validateUrlSyntax("https://github.com/aldevvv/graphixl");
  assert.equal(u1.hostname, "github.com");
  assert.equal(u1.protocol, "https:");

  const u2 = validateUrlSyntax("http://example.com/blog/article");
  assert.equal(u2.hostname, "example.com");
  assert.equal(u2.protocol, "http:");
});

test("URL syntax validation: rejects invalid protocols", () => {
  assert.throws(() => validateUrlSyntax("ftp://example.com"), SsrfSecurityError);
  assert.throws(() => validateUrlSyntax("file:///etc/passwd"), SsrfSecurityError);
  assert.throws(() => validateUrlSyntax("javascript:alert(1)"), SsrfSecurityError);
});

test("URL syntax validation: rejects embedded credentials", () => {
  assert.throws(() => validateUrlSyntax("https://admin:secret@example.com"), SsrfSecurityError);
});

test("URL syntax validation: rejects local and internal hostnames", () => {
  assert.throws(() => validateUrlSyntax("http://localhost:3000"), SsrfSecurityError);
  assert.throws(() => validateUrlSyntax("http://my-service.local"), SsrfSecurityError);
  assert.throws(() => validateUrlSyntax("http://metadata.google.internal"), SsrfSecurityError);
});
