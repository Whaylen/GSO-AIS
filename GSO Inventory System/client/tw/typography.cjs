const typography = (theme) => {
  return {
    DEFAULT: {
      css: {
        a: {
          color: theme("colors.blue.500"),
          textDecoration: "none",
          "&:hover": {
            textDecoration: "underline",
          },
        },
        p: {
          marginTop: "0.75rem",
          marginBottom: "0.75rem",
          "&:first": {
            marginTop: "0",
          },
          "&:last": {
            marginBottom: "0",
          },
        },
        img: {
          marginTop: "0",
          marginBottom: "0",
          display: "inline-block",
        },
      },
    },
    lg: {
      css: {
        img: {
          marginTop: "0",
          marginBottom: "0",
          display: "inline-block",
        },
      },
    },
  };
};

module.exports = typography;
