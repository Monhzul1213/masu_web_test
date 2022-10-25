export function getItem(label, key, icon, children, type) {
  return { key, icon, children, label, type };
}

export function validateEmail(mail) {
  let emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if(mail?.match(emailRegex))
    return true;
  else
    return false;
}