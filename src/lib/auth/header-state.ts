export function getHeaderAuthMode(userEmail?: string | null) {
  return userEmail ? "signed-in" : "signed-out";
}

export function shouldShowSignOut(userEmail?: string | null) {
  return Boolean(userEmail);
}

export function shouldShowSignInActions(userEmail?: string | null) {
  return !userEmail;
}
