export default {
  welcome: 'Welcome',
  theme: {
    toggle: 'Toggle theme',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
  },
  common: {
    dashboard: 'Dashboard',
    signOut: 'Sign Out',
    saveChanges: 'Save Changes',
    saving: 'Saving...',
    cancel: 'Cancel',
    backToHome: 'Back to Home',
    tryAgain: 'Try Again',
  },
  user: {
    profilePicture: 'Profile Picture',
    upload: 'Upload',
    delete: 'Delete',
    uploading: 'Uploading...',
    profilePictureUploaded: 'Profile Picture Updated',
    profilePictureUploadedDescription:
      'Your profile picture has been updated successfully.',
    profilePictureUploadError: 'Upload Failed',
    profilePictureUploadErrorDescription:
      'There was an error uploading your profile picture.',
    profilePictureDeleted: 'Profile Picture Deleted',
    profilePictureDeletedDescription:
      'Your profile picture has been deleted successfully.',
    profilePictureDeleteError: 'Delete Failed',
    profilePictureDeleteErrorDescription:
      'There was an error deleting your profile picture.',
    fileTooLarge: 'File Too Large',
    fileTooLargeDescription: 'The image must be less than 5MB.',
    invalidFileType: 'Invalid File Type',
    invalidFileTypeDescription:
      'Please upload a JPEG, PNG, GIF, or WebP image file.',
    fileUploaded: 'File Uploaded',
    fileUploadedDescription: 'Your file has been uploaded successfully.',
    fileUploadError: 'Upload Failed',
    fileUploadErrorDescription: 'There was an error uploading your file.',
    fileDeleted: 'File Deleted',
    fileDeletedDescription: 'Your file has been deleted successfully.',
    fileDeleteError: 'Delete Failed',
    fileDeleteErrorDescription: 'There was an error deleting your file.',
    profileTitle: 'Your Profile',
    profileInformation: 'Profile Information',
    editProfileInformation: 'View and edit your profile information',
    uploadProfilePicture: 'Upload your profile picture',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    phoneNumber: 'Phone Number',
    firstNamePlaceholder: 'Enter your first name',
    lastNamePlaceholder: 'Enter your last name',
    phoneNumberPlaceholder: 'Enter your phone number',
    update: {
      success: 'User updated successfully',
      error: 'Failed to update user',
    },
  },
  userMenu: {
    upgradePlan: 'Upgrade your plan',
    managePlan: 'Manage your plan',
    account: 'Account',
    notifications: 'Notifications',
    logOut: 'Log out',
  },
  payments: {
    paymentSuccessful: 'Payment Successful!',
    thankYouForPurchase: 'Thank you for your purchase!',
    checkYourEmail: 'Check your email for a receipt of your payment.',
    paymentCanceled: 'Payment Canceled',
    paymentCanceledMessage: 'Your payment was canceled. No charges were made.',
    needHelp: 'Need help? Contact our support team.',
  },
  subscriptions: {
    choosePlan: 'Choose the right plan for you',
    noPlans: 'No subscription plans available at this time.',
    subscribe: 'Subscribe',
    manageSubscription: 'Manage Subscription',
    recommended: 'RECOMMENDED',
    includes: 'Includes:',
    basicFeatures: 'Basic features included',
    billedMonthly: 'Billed monthly',
    billedAnnually: 'Billed annually',
    subscribeSubtext:
      'Get access to all our premium features with flexible subscription options',
  },
  errors: {
    errorOccurred: 'An Error Occurred',
    genericError: 'Something went wrong. Please try again.',
    notFound: 'Not Found',
    notFoundDescription: 'The page you are looking for does not exist.',
    unauthorized: 'Unauthorized',
    unauthorizedDescription: 'You are not authorized to access this page.',
    exportDiagramPng: 'Error exporting diagram as PNG',
    copyXml: 'Error copying XML',
    xmlParsing: 'Failed to parse BPMN diagram',
    cannotGetCanvas: 'Could not get canvas context',
    cannotCreateBlob: 'Could not create blob',
  },
  auth: {
    title: {
      signIn: 'Sign in to your account',
      signUp: 'Create an account',
      forgotPassword: 'Reset your password',
      resetPassword: 'Create new password',
    },
    email: {
      label: 'Email',
      description: 'Please enter your email address.',
      placeholder: 'Enter your email',
    },
    password: {
      label: 'Password',
      description: 'Please enter your password.',
      placeholder: 'Enter your password',
      newPassword: 'New Password',
      confirmPassword: 'Confirm Password',
    },
    activationCode: {
      label: 'Activation Code',
      description: 'Please enter your activation code if you have one.',
      placeholder: 'Enter activation code',
    },
    forgotPassword: {
      link: 'Forgot password?',
      description:
        'Enter your email address and we will send you a link to reset your password.',
      success: 'Check your email',
      successDescription:
        'If an account exists for this email, we have sent password reset instructions.',
      error: 'Failed to request password reset',
    },
    resetPassword: {
      description: 'Please enter a new password for your account.',
      success: 'Password reset successful',
      successDescription:
        'Your password has been reset. You can now log in with your new password.',
      invalidToken: 'Invalid or expired token',
      invalidTokenDescription:
        'The password reset link is invalid or has expired. Please request a new one.',
    },
    processing: 'Processing...',
    buttons: {
      signIn: 'Login',
      signUp: 'Sign Up',
      toggleToSignIn: 'Already have an account? Login',
      toggleToSignUp: 'Need an account? Sign Up',
      resetPassword: 'Reset Password',
      sendResetLink: 'Send Reset Link',
      backToLogin: 'Back to login',
    },
    signUp: {
      success: 'Sign-up successful!',
      error: 'Failed to sign-up',
    },
    signIn: {
      success: 'Sign-in successful!',
      error: 'Failed to sign-in',
    },
    signOut: {
      success: 'Sign-out successful!',
      error: 'Failed to sign-out',
    },
  },
  s3: {
    fileUpload: {
      success: 'File uploaded successfully',
      error: 'Failed to upload file',
    },
    fileDelete: {
      success: 'File deleted successfully',
      error: 'Failed to delete file',
    },
    fileConfirm: {
      success: 'File confirmed successfully',
      error: 'Failed to confirm file',
    },
  },
  stripe: {
    checkoutSession: {
      success: 'Checkout session created successfully!',
      error: 'Failed to create checkout session',
    },
    customerPortalSession: {
      success: 'Customer portal session created successfully!',
      error: 'Failed to create customer portal session',
    },
  },
  // Chat related translations
  header: {
    chatLink: 'Chat',
  },
  chat: {
    fullscreenMode: 'Fullscreen Mode',
    windowMode: 'Window Mode',
    title: 'AI Assistant',
    footer: 'Powered by Acqua',
    bubble: {
      text: 'Chat with AI',
    },
    status: {
      sending: 'Sending...',
    },
    input: {
      placeholder: 'Message AI Assistant...',
      sendButton: 'Send message',
      label: 'Chat input',
    },
    messages: {
      helpMessage: 'How can I assist you today?',
      welcome: 'Welcome!',
      thinking: 'Thinking...',
      you: 'You',
      assistant: 'Assistant',
      label: 'Chat messages',
    },
    header: {
      newChat: 'New chat',
      clearConfirm:
        'Are you sure you want to clear all messages? This cannot be undone.',
      closeButton: 'Close chat',
    },
    errors: {
      connection: 'Connection Error',
      connectionDescription:
        'There was a problem connecting to the chat service.',
      lostConnection: 'Lost connection to the chat service.',
      tryAgain: 'Try Again',
      reconnect: 'Reconnect',
      submitFailed: 'Failed to send message',
      generic: 'Something went wrong',
      sendFailed: 'Failed to send message',
      networkError: 'Network error occurred',
      serverError: 'Server error occurred',
      timeout: 'Request timed out',
      emptyMessage: 'Please enter a message',
      messageTooLong: 'Message too long (max {{max}} characters)',
      disabled: 'Input is currently disabled',
    },
    windowChat: {
      title: 'Window Chat Mode',
      description:
        'The chat window will appear in the bottom right corner of your screen.',
    },
    custom: {
      title: 'Connect to Your n8n Workflow',
      webhookLabel: 'Enter your n8n Webhook URL:',
      webhookDescription:
        'This URL connects to your n8n workflow for AI chat functionality.',
      submitButton: 'Connect & Start Chat',
      exampleUrl:
        'Example URL: https://n8n.example.com/webhook/your-workflow-id/chat',
      changeUrlButton: 'Change URL',
    },
  },
  i18n: {
    direct: {
      title: 'AI Assistant',
      subtitle: 'Your AI assistant',
      footer: 'Powered by n8n',
      inputPlaceholder: 'Ask me...',
      closeButtonTooltip: 'Close chat',
      helpMessage: 'How can I assist you today?',
      initialMessage: "I'm here to help you. What can I do for you today?",
    },
    custom: {
      title: 'AI Assistant',
      subtitle: 'Custom workflow integration',
      footer: 'Powered by n8n',
      inputPlaceholder: 'Type your message here...',
      closeButtonTooltip: 'Close chat',
      helpMessage: 'How can I help you today?',
    },
  },
  direct: {
    title: 'Direct Access Mode',
    description:
      "You're connected to a dedicated AI assistant with a pre-configured webhook.",
    features: {
      feature1: 'No setup required',
      feature2: 'Instant access to the assistant',
      feature3: 'Using a pre-configured workflow',
    },
  },
  footer: {
    copyright: 'Acqua AI. All rights reserved.',
  },
  bpmn: {
    diagram: 'BPMN Diagram',
    xml: 'BPMN XML',
    showXml: 'Show XML',
    showDiagram: 'Show Diagram',
    exportPng: 'Export as PNG',
    copyXml: 'Copy XML',
    loadingDiagram: 'Loading diagram...',
    diagramError: 'Diagram Error',
  },
} as const;
