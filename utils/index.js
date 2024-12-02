export const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const validateFirstName = (firstName) => {
  const regex = /^[a-zA-Z]+$/
  return regex.test(firstName)
}

export const validatePhoneNumber = (phoneNumber) => {
  const regex = /^(?:\(\d{3}\)\s?|\d{3}[-.\s])?\d{3}[-.\s]?\d{4}$/
  return regex.test(phoneNumber)
}