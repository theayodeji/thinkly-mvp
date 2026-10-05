import React from "react";
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
} from "@react-email/components";

interface OTPEmailProps {
  otp: string;
  purpose: string;
}

export const OTPEmail = ({ otp, purpose }: OTPEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your Thinkly verification code: {otp}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Thinkly Verification</Heading>
          <Text style={paragraph}>
            Use the verification code below for your <strong>{purpose}</strong> request:
          </Text>
          <Section style={codeBox}>
            <Text style={codeText}>{otp}</Text>
          </Section>
          <Text style={subtext}>
            This code is valid for <strong>10 minutes</strong>. If you did not request this, please ignore this email.
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            © {new Date().getFullYear()} Thinkly Inc. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default OTPEmail;

const main: React.CSSProperties = {
  backgroundColor: "#f8fafc",
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  padding: "40px 0",
};

const container: React.CSSProperties = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "32px",
  borderRadius: "16px",
  maxWidth: "520px",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
};

const heading: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#0f172a",
  textAlign: "center",
  marginBottom: "24px",
};

const paragraph: React.CSSProperties = {
  fontSize: "15px",
  color: "#334155",
  lineHeight: "24px",
};

const codeBox: React.CSSProperties = {
  backgroundColor: "#f1f5f9",
  borderRadius: "12px",
  padding: "20px",
  textAlign: "center",
  margin: "24px 0",
};

const codeText: React.CSSProperties = {
  fontFamily: "monospace",
  fontSize: "36px",
  fontWeight: "bold",
  letterSpacing: "8px",
  color: "#2563eb",
  margin: "0",
};

const subtext: React.CSSProperties = {
  fontSize: "13px",
  color: "#64748b",
  lineHeight: "20px",
};

const hr: React.CSSProperties = {
  borderColor: "#e2e8f0",
  margin: "32px 0 16px",
};

const footer: React.CSSProperties = {
  fontSize: "12px",
  color: "#94a3b8",
  textAlign: "center",
};
