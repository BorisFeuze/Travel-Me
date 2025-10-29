type DiaryFormData = {
  title: string;
  newDate: string;
  imgUrl: string;
  message: string;
};

type DiaryFormErrors = Partial<Record<keyof DiaryFormData, string>>;

const isValidUrl = (testUrl: string): boolean => {
  try {
    new URL(testUrl);
    return true;
  } catch {
    return false;
  }
};

const validateDiaryForm = ({
  title,
  newDate,
  imgUrl,
  message,
}: DiaryFormData): DiaryFormErrors => {
  const newErrors: DiaryFormErrors = {};

  if (!title.trim()) newErrors.title = "Title is required";
  if (!newDate.trim()) newErrors.newDate = "Date is required";
  if (!imgUrl.trim()) {
    newErrors.imgUrl = "Image is required";
  } else if (!isValidUrl(imgUrl)) {
    newErrors.imgUrl = "Image must be a valid URL";
  }
  if (!message.trim()) newErrors.message = "Content is required";

  return newErrors;
};

export { isValidUrl, validateDiaryForm };
