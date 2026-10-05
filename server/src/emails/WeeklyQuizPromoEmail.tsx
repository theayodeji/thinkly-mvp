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
  Button,
  Hr,
} from "@react-email/components";

interface WeeklyQuizPromoEmailProps {
  name: string;
  streakCount?: number;
  quizUrl?: string;
}

export const WeeklyQuizPromoEmail = ({
  name = "Scholar",
  streakCount = 0,
  quizUrl = "https://thinkly.app/spaces",
}: WeeklyQuizPromoEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Keep your study streak alive! Take your weekly practice quiz.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>🔥 Weekly Study Challenge</Heading>
          <Text style={paragraph}>Hi {name},</Text>
          <Text style={paragraph}>
            You currently have a <strong>{streakCount}-day study streak</strong>! Keep the momentum going by taking your weekly practice quiz on Thinkly.
          </Text>
          <Section style={btnContainer}>
            <Button style={button} href={quizUrl}>
              Take Weekly Practice Quiz
            </Button>
          </Section>
          <Text style={subtext}>
            Regular active recall testing increases long-term retention by up to 150%. Take 5 minutes today to review your spaces!
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

export default WeeklyQuizPromoEmail;

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
  marginBottom: "20px",
};

const paragraph: React.CSSProperties = {
  fontSize: "15px",
  color: "#334155",
  lineHeight: "24px",
};

const btnContainer: React.CSSProperties = {
  textAlign: "center",
  margin: "28px 0",
};

const button: React.CSSProperties = {
  backgroundColor: "#16a34a",
  borderRadius: "10px",
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center",
  display: "inline-block",
  padding: "12px 24px",
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
