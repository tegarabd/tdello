export const isValidEmail = email => {
  let at = 0;
  let dotAfterAt = 0;

  if (
    email.startsWith(".") ||
    email.startsWith("@") ||
    email.endsWith(".") ||
    email.endsWith("@")
  )
    return false;

  for (let i = 0; i < email.length; i++) {
    let ch = email.charAt(i);

    if ((s => s.raw)`${email}`[0].charAt(i) === "\\") return false;
    if (
      !(
        (ch >= "a" && ch <= "z") ||
        (ch >= "A" && ch <= "Z") ||
        (ch >= "0" && ch <= "9") ||
        ch === "@" ||
        ch === "."
      )
    )
      return false;
    if (ch === "@") {
      if (email.charAt(i + 1) === ".") return false;
      at++;
    }
    if (ch === ".") {
      if (email.charAt(i + 1) === "." || email.charAt(i + 1) === "@")
        return false;
      if (at > 0) dotAfterAt++;
    }
  }

  if (at < 1 || at > 1) return false;
  if (dotAfterAt < 1 || dotAfterAt > 2) return false;

  return true;
};

export const isAlphaNumberic = password => {
  let alpha = false;
  let number = false;

  for (let i = 0; i < password.length; i++) {
    const char = password.charAt(i);
    if ((char >= "A" && char <= "Z") || (char >= "a" && char <= "z"))
      alpha = true;
    if (char >= "0" && char <= "9") number = true;
    if (alpha && number) return true;
  }

  return false;
};
