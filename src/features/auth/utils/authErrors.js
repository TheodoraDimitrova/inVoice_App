export const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export const getAuthErrorMessage = (code) => {
  switch (code) {
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Грешен имейл или парола.";
    case "auth/user-not-found":
      return "Няма потребител с този имейл.";
    case "auth/email-already-in-use":
      return "Имейлът вече се използва.";
    case "auth/weak-password":
      return "Паролата трябва да е поне 6 символа.";
    case "auth/too-many-requests":
      return "Твърде много опити. Опитайте по-късно.";
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
      return null;
    case "auth/account-exists-with-different-credential":
      return "Този имейл вече е регистриран с друг метод за вход.";
    case "auth/unauthorized-domain":
      return "Домейнът не е разрешен в Firebase. Добавете го в Authentication → Settings → Authorized domains.";
    case "auth/operation-not-allowed":
      return "Входът с Google не е включен. Активирайте го в Firebase Console → Authentication → Sign-in method.";
    case "auth/popup-blocked-by-browser":
      return "Браузърът блокира прозореца за Google. Разрешете pop-up за този сайт и опитайте отново.";
    case "auth/network-request-failed":
      return "Мрежова грешка. Проверете връзката и опитайте отново.";
    default:
      return null;
  }
};
