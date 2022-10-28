export function getItem(label, key, icon, children, type) {
  return { key, icon, children, label, type };
}

export function validateEmail(mail) {
  let emailRegex = /(^[^@.]+)@([^@.]+)\.{1}(\w{1,9}$)/;
  if(mail?.match(emailRegex))
    return true;
  else
    return false;
}