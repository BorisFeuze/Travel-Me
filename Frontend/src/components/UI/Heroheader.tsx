import * as React from "react";
import { Box, Container, Stack, Typography, Button } from "@mui/material";
import type { SxProps } from "@mui/system";
import type { Theme } from "@mui/material/styles";
import heroImg from "../../assets/images/image1.jpg";

type Media = { type: "image"; src: string; alt: string } | { type: "none" };

export type HeroheaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  primaryCta?: { label: string; href?: string; onClick?: () => void };
  secondaryCta?: { label: string; href?: string; onClick?: () => void };
  align?: "left" | "center";
  bgImageUrl?: string; // optional background image
  overlayOpacity?: number; // 0..1 (default 0.4)
  media?: Media; // optional inline image on the right (simple)
  sx?: SxProps<Theme>; // extra style hook
};

const Heroheader: React.FC<HeroheaderProps> = ({
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  align = "center",
  bgImageUrl,
  // overlayOpacity = 0.4,
  // media = { type: "none" },
  sx,
}) => {
  const isCenter = align === "center";

  return (
    <Box
      component="header"
      sx={{
        position: "relative",
        backgroundImage: `url(${bgImageUrl ?? heroImg})`,
        backgroundSize: "cover",
        // Show more of the top for portrait shots:
        backgroundPosition: { xs: "center top", md: "center 30%" },
        backgroundRepeat: "no-repeat",
        // Give the image room — responsive height/aspect
        minHeight: { xs: 320, sm: 420, md: 520 },
        display: "flex",
        ...sx,
      }}
    >
      <Container>
        <Stack
          spacing={2}
          sx={{
            position: "relative",
            zIndex: 2,
            textAlign: isCenter ? "center" : "left",
            padding: "100px 0",
          }}
        >
          {eyebrow && (
            <Typography variant="h5" color="#C6F36B">
              {eyebrow}
            </Typography>
          )}
          <Typography variant="h1" color="#C6F36B">
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="h5" color="#C6F36B">
              {subtitle}
            </Typography>
          )}
          <Stack
            direction="row"
            spacing={2}
            justifyContent={isCenter ? "center" : "flex-start"}
          >
            {primaryCta && (
              <Button
                variant="contained"
                color="primary"
                href={primaryCta.href}
                onClick={primaryCta.onClick}
              >
                {primaryCta.label}
              </Button>
            )}
            {secondaryCta && (
              <Button
                variant="outlined"
                color="primary"
                href={secondaryCta.href}
                onClick={secondaryCta.onClick}
              >
                {secondaryCta.label}
              </Button>
            )}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Heroheader;
