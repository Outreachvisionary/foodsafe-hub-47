
// This file augments testing-library types to fix type errors
declare module '@testing-library/react' {
  export const screen: any;
  export const waitFor: any;
  export const render: any;
  export const fireEvent: any;
  export const act: any;
  export const cleanup: any;
  export const within: any;
}
