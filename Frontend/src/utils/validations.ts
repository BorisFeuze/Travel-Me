const isValidUrl = (testUrl) => {
  try {
    new URL(testUrl);
    return true;
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return false;
  }
};

const validateDiaryForm = ({ title, newDate, imgUrl, message }) => {
  const newErrors = {};
  if (!title.trim()) newErrors.title = "Title is required";
  if (!newDate.trim()) newErrors.newDate = "Date is required";
  if (!imgUrl.trim()) {
    newErrors.imgUrl = "Image is required";
  } else if (!isValidUrl(imgUrl)) {
    newErrors.imgUrl = " Image must be a valid URL";
  }
  if (!message.trim()) newErrors.message = "Content is required";

  return newErrors;
};

export { isValidUrl, validateDiaryForm };
