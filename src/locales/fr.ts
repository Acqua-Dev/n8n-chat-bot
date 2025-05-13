export default {
  welcome: 'Bienvenue',
  theme: {
    toggle: 'Changer de thème',
    light: 'Clair',
    dark: 'Sombre',
    system: 'Système',
  },
  common: {
    dashboard: 'Tableau de bord',
    signOut: 'Déconnexion',
    saveChanges: 'Enregistrer les modifications',
    saving: 'Enregistrement...',
    cancel: 'Annuler',
    backToHome: "Retour à l'accueil",
  },
  user: {
    profilePicture: 'Photo de profil',
    upload: 'Télécharger',
    delete: 'Supprimer',
    uploading: 'Téléchargement en cours...',
    profilePictureUploaded: 'Photo de profil mise à jour',
    profilePictureUploadedDescription:
      'Votre photo de profil a été mise à jour avec succès.',
    profilePictureUploadError: 'Échec du téléchargement',
    profilePictureUploadErrorDescription:
      'Une erreur est survenue lors du téléchargement de votre photo de profil.',
    profilePictureDeleted: 'Photo de profil supprimée',
    profilePictureDeletedDescription:
      'Votre photo de profil a été supprimée avec succès.',
    profilePictureDeleteError: 'Échec de la suppression',
    profilePictureDeleteErrorDescription:
      'Une erreur est survenue lors de la suppression de votre photo de profil.',
    fileTooLarge: 'Fichier trop volumineux',
    fileTooLargeDescription: "L'image doit être inférieure à 5 Mo.",
    invalidFileType: 'Type de fichier invalide',
    invalidFileTypeDescription:
      'Veuillez télécharger une image JPEG, PNG, GIF ou WebP.',
    fileUploaded: 'Fichier téléchargé',
    fileUploadedDescription: 'Votre fichier a été téléchargé avec succès.',
    fileUploadError: 'Échec du téléchargement',
    fileUploadErrorDescription:
      'Une erreur est survenue lors du téléchargement de votre fichier.',
    fileDeleted: 'Fichier supprimé',
    fileDeletedDescription: 'Votre fichier a été supprimé avec succès.',
    fileDeleteError: 'Échec de la suppression',
    fileDeleteErrorDescription:
      'Une erreur est survenue lors de la suppression de votre fichier.',
    profileTitle: 'Votre profil',
    profileInformation: 'Informations de profil',
    editProfileInformation: 'Consultez et modifiez vos informations de profil',
    uploadProfilePicture: 'Téléchargez votre photo de profil',
    firstName: 'Prénom',
    lastName: 'Nom',
    email: 'Email',
    phoneNumber: 'Numéro de téléphone',
    firstNamePlaceholder: 'Entrez votre prénom',
    lastNamePlaceholder: 'Entrez votre nom',
    phoneNumberPlaceholder: 'Entrez votre numéro de téléphone',
    update: {
      success: 'Utilisateur mis à jour avec succès',
      error: "Échec de la mise à jour de l'utilisateur",
    },
  },
  userMenu: {
    upgradePlan: 'Passer à un plan supérieur',
    managePlan: 'Gérer votre plan',
    account: 'Compte',
    notifications: 'Notifications',
    logOut: 'Déconnexion',
  },
  payments: {
    paymentSuccessful: 'Paiement réussi !',
    thankYouForPurchase: 'Merci pour votre achat !',
    checkYourEmail: 'Consultez votre email pour le reçu de votre paiement.',
    paymentCanceled: 'Paiement annulé',
    paymentCanceledMessage:
      "Votre paiement a été annulé. Aucun frais n'a été prélevé.",
    needHelp: "Besoin d'aide ? Contactez notre équipe de support.",
  },
  subscriptions: {
    choosePlan: 'Choisissez le forfait qui vous convient',
    noPlans: "Aucun plan d'abonnement n'est disponible pour le moment.",
    subscribe: "S'abonner",
    manageSubscription: "Gérer l'abonnement",
    recommended: 'RECOMMANDÉ',
    includes: 'Inclus:',
    basicFeatures: 'Fonctionnalités de base incluses',
    billedMonthly: 'Facturation mensuelle',
    billedAnnually: 'Facturation annuelle',
    subscribeSubtext:
      "Accédez à toutes nos fonctionnalités premium avec des options d'abonnement flexibles",
  },
  errors: {
    errorOccurred: 'Une erreur est survenue',
    genericError: 'Une erreur est survenue. Veuillez réessayer.',
    notFound: 'Page non trouvée',
    notFoundDescription: "La page que vous recherchez n'existe pas.",
    unauthorized: 'Non autorisé',
    unauthorizedDescription: "Vous n'êtes pas autorisé à accéder à cette page.",
  },
  auth: {
    title: {
      signIn: 'Connectez-vous à votre compte',
      signUp: 'Créer un compte',
      forgotPassword: 'Réinitialiser votre mot de passe',
      resetPassword: 'Créer un nouveau mot de passe',
    },
    email: {
      label: 'Email',
      description: 'Veuillez entrer votre adresse email.',
      placeholder: 'Entrez votre email',
    },
    password: {
      label: 'Mot de passe',
      description: 'Veuillez entrer votre mot de passe.',
      placeholder: 'Entrez votre mot de passe',
      newPassword: 'Nouveau mot de passe',
      confirmPassword: 'Confirmer le mot de passe',
    },
    activationCode: {
      label: "Code d'activation",
      description:
        "Veuillez entrer votre code d'activation si vous en avez un.",
      placeholder: "Entrez le code d'activation",
    },
    forgotPassword: {
      link: 'Mot de passe oublié?',
      description:
        'Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.',
      success: 'Vérifiez votre email',
      successDescription:
        'Si un compte existe pour cet email, nous avons envoyé des instructions de réinitialisation de mot de passe.',
      error: 'Échec de la demande de réinitialisation du mot de passe',
    },
    resetPassword: {
      description: 'Veuillez entrer un nouveau mot de passe pour votre compte.',
      success: 'Mot de passe réinitialisé',
      successDescription:
        'Votre mot de passe a été réinitialisé. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.',
      invalidToken: 'Jeton invalide ou expiré',
      invalidTokenDescription:
        'Le lien de réinitialisation du mot de passe est invalide ou a expiré. Veuillez en demander un nouveau.',
    },
    processing: 'En cours de traitement...',
    buttons: {
      signIn: 'Se connecter',
      signUp: "S'inscrire",
      toggleToSignIn: 'Vous avez déjà un compte? Connectez-vous',
      toggleToSignUp: "Besoin d'un compte? Inscrivez-vous",
      resetPassword: 'Réinitialiser le mot de passe',
      sendResetLink: 'Envoyer le lien de réinitialisation',
      backToLogin: 'Retour à la connexion',
    },
    signUp: {
      success: 'Inscription réussie !',
      error: "Échec de l'inscription",
    },
    signIn: {
      success: 'Connexion réussie !',
      error: 'Échec de la connexion',
    },
    signOut: {
      success: 'Déconnexion réussie !',
      error: 'Échec de la déconnexion',
    },
  },
  s3: {
    fileUpload: {
      success: 'Fichier téléchargé avec succès',
      error: 'Échec du téléchargement du fichier',
    },
    fileDelete: {
      success: 'Fichier supprimé avec succès',
      error: 'Échec de la suppression du fichier',
    },
    fileConfirm: {
      success: 'Fichier confirmé avec succès',
      error: 'Échec de la confirmation du fichier',
    },
  },
  stripe: {
    checkoutSession: {
      success: 'Session de paiement créée avec succès !',
      error: 'Échec de la création de la session de paiement',
    },
    customerPortalSession: {
      success: 'Session du portail client créée avec succès !',
      error: 'Échec de la création de la session du portail client',
    },
  },
} as const;
