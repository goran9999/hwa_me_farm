export const selectStyles = {
  container: (base: any) => ({
    ...base,
    width: "100%",
    background: "#111827",
  }),
  control: (base: any) => ({
    ...base,
    background: "#111827",
    color: "white",
  }),
  input: (base: any) => ({
    ...base,
    color: "white",
  }),
  indicatorSeparator: (base: any) => ({ ...base, display: "none" }),
  menu: (base: any) => ({
    ...base,
    background: "#111827",
    border: "1px solid rgb(64,63,63)",
    ":hover": {
      borderBottom: "1px solid rgb(64,63,63) ",
    },
  }),
  option: (base: any) => ({
    ...base,
    background: "#111827",
    cursor: "pointer",
  }),
};
