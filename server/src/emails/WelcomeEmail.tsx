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

interface WelcomeEmailProps {
  name: string;
  dashboardUrl?: string;
}

export const WelcomeEmail = ({
  name = "Scholar",
  dashboardUrl = "https://thinkly.app/dashboard",
}: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Thinkly, {name}! Let's transform how you study.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Welcome to Thinkly! 🚀</Heading>
          <Text style={paragraph}>Hi {name},</Text>
          <Text style={paragraph}>
            We're thrilled to have you join Thinkly. Your personalized AI-powered study space is ready to help you summarize notes, generate flashcards & quizzes, and create visual learning paths.
          </Text>
          <Section style={btnContainer}>
            <Button style={button} href={dashboardUrl}>
              Go to Your Dashboard
            </Button>
          </Section>
          <Text style={paragraph}>
            Here are a few things you can do right away:
          </Text>
          <Text style={listItem}>• <strong>Create a Study Space</strong> and upload your lecture notes or PDFs.</Text>
          <Text style={listItem}>• <strong>Generate Flashcards</strong> for quick self-testing before exams.</Text>
          <Text style={listItem}>• <strong>Listen to Audio Explainers</strong> on complex study concepts.</Text>
          <Hr style={hr} />
          <Text style={footer}>
            © {new Date().getFullYear()} Thinkly Inc. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeEmail;

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

const listItem: React.CSSProperties = {
  fontSize: "14px",
  color: "#475569",
  lineHeight: "22px",
  margin: "4px 0",
};

const btnContainer: React.CSSProperties = {
  textAlign: "center",
  margin: "28px 0",
};

const button: React.CSSProperties = {
  backgroundColor: "#2563eb",
  borderRadius: "10px",
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center",
  display: "inline-block",
  padding: "12px 24px",
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
