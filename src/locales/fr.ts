export default {
  welcome: 'Bienvenue',
  theme: {
    toggle: 'Basculer le thème',
    light: 'Clair',
    dark: 'Sombre',
    system: 'Système',
  },
  common: {
    dashboard: 'Tableau de bord',
    signOut: 'Se déconnecter',
    saveChanges: 'Enregistrer les modifications',
    saving: 'Enregistrement...',
    cancel: 'Annuler',
    backToHome: "Retour à l'accueil",
    tryAgain: 'Réessayer',
  },
  user: {
    profilePicture: 'Photo de profil',
    upload: 'Télécharger',
    delete: 'Supprimer',
    uploading: 'Téléchargement...',
    profilePictureUploaded: 'Photo de profil mise à jour',
    profilePictureUploadedDescription:
      'Votre photo de profil a été mise à jour avec succès.',
    profilePictureUploadError: 'Échec du téléchargement',
    profilePictureUploadErrorDescription:
      "Une erreur s'est produite lors du téléchargement de votre photo de profil.",
    profilePictureDeleted: 'Photo de profil supprimée',
    profilePictureDeletedDescription:
      'Votre photo de profil a été supprimée avec succès.',
    profilePictureDeleteError: 'Échec de la suppression',
    profilePictureDeleteErrorDescription:
      "Une erreur s'est produite lors de la suppression de votre photo de profil.",
    fileTooLarge: 'Fichier trop volumineux',
    fileTooLargeDescription: "L'image doit faire moins de 5 Mo.",
    invalidFileType: 'Type de fichier invalide',
    invalidFileTypeDescription:
      'Veuillez télécharger un fichier image JPEG, PNG, GIF ou WebP.',
    fileUploaded: 'Fichier téléchargé',
    fileUploadedDescription: 'Votre fichier a été téléchargé avec succès.',
    fileUploadError: 'Échec du téléchargement',
    fileUploadErrorDescription:
      "Une erreur s'est produite lors du téléchargement de votre fichier.",
    fileDeleted: 'Fichier supprimé',
    fileDeletedDescription: 'Votre fichier a été supprimé avec succès.',
    fileDeleteError: 'Échec de la suppression',
    fileDeleteErrorDescription:
      "Une erreur s'est produite lors de la suppression de votre fichier.",
    profileTitle: 'Votre profil',
    profileInformation: 'Informations du profil',
    editProfileInformation: 'Consulter et modifier vos informations de profil',
    uploadProfilePicture: 'Télécharger votre photo de profil',
    profilePictureDescription:
      'Votre photo de profil sera affichée sur votre profil et dans les commentaires.',
    name: 'Nom',
    nameDescription: 'Votre nom sera affiché sur votre profil.',
    namePlaceholder: 'Entrez votre nom',
    nameUpdated: 'Nom mis à jour',
    nameUpdatedDescription: 'Votre nom a été mis à jour avec succès.',
    nameUpdateError: 'Échec de la mise à jour du nom',
    nameUpdateErrorDescription:
      "Une erreur s'est produite lors de la mise à jour de votre nom.",
  },
  dashboard: {
    title: 'Tableau de bord',
    subtitle: 'Aperçu de votre compte',
    welcome: 'Bienvenue, {name}!',
    quickActions: 'Actions rapides',
    selectWorkspacePlaceholder: 'Sélectionner un espace de travail',
  },
  bpmn: {
    title: 'Exportation de diagramme BPMN',
    copy: 'Copier',
    download: 'Télécharger',
    copied: 'Copié!',
    downloadFailed: 'Échec du téléchargement',
    copyFailed: 'Échec de la copie',
    downloadSuccess: 'Téléchargement réussi',
    showXml: 'Afficher XML',
    showDiagram: 'Afficher le diagramme',
    diagram: 'Diagramme BPMN',
    xml: 'XML BPMN',
  },
  errors: {
    unexpected: "Une erreur inattendue s'est produite",
    noCanvasElement: 'Aucun élément canvas trouvé',
    exportFailed: "Échec de l'exportation du fichier",
    xmlParsing: "Échec de l'analyse du diagramme BPMN",
    cannotGetCanvas: "Impossible d'obtenir le contexte du canvas",
    cannotCreateBlob: 'Impossible de créer le blob',
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
        'Si un compte existe pour cet email, nous avons envoyé des instructions de réinitialisation du mot de passe.',
      error: 'Échec de la demande de réinitialisation du mot de passe',
    },
    resetPassword: {
      description: 'Veuillez entrer un nouveau mot de passe pour votre compte.',
      success: 'Réinitialisation du mot de passe réussie',
      successDescription:
        'Votre mot de passe a été réinitialisé. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.',
      invalidToken: 'Jeton invalide ou expiré',
      invalidTokenDescription:
        'Le lien de réinitialisation du mot de passe est invalide ou a expiré. Veuillez en demander un nouveau.',
    },
    processing: 'Traitement...',
    buttons: {
      signIn: 'Se connecter',
      signUp: "S'inscrire",
      toggleToSignIn: 'Vous avez déjà un compte? Se connecter',
      toggleToSignUp: "Besoin d'un compte? S'inscrire",
      resetPassword: 'Réinitialiser le mot de passe',
      sendResetLink: 'Envoyer le lien de réinitialisation',
      backToLogin: 'Retour à la connexion',
    },
    signUp: {
      success: 'Inscription réussie!',
      error: "Échec de l'inscription",
    },
    signIn: {
      success: 'Connexion réussie!',
      error: 'Échec de la connexion',
    },
    signOut: {
      success: 'Déconnexion réussie!',
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
      success: 'Session de paiement créée avec succès!',
      error: 'Échec de la création de la session de paiement',
    },
    customerPortalSession: {
      success: 'Session du portail client créée avec succès!',
      error: 'Échec de la création de la session du portail client',
    },
  },
  // Chat related translations
  header: {
    chatLink: 'Chat',
  },
  chat: {
    fullscreenMode: 'Mode Plein Écran',
    windowMode: 'Mode Fenêtre',
    title: 'Assistant IA',
    footer: 'Propulsé par Acqua',
    bubble: {
      text: "Discuter avec l'IA",
    },
    input: {
      placeholder: "Message à l'assistant IA...",
      sendButton: 'Envoyer le message',
      label: 'Entrée de chat',
    },
    status: {
      sending: 'Envoi en cours...',
    },
    messages: {
      helpMessage: "Comment puis-je vous aider aujourd'hui?",
      welcome: 'Bienvenue!',
      thinking: 'Réflexion...',
      you: 'Vous',
      assistant: 'Assistant',
      label: 'Messages du chat',
    },
    header: {
      newChat: 'Nouveau chat',
      clearConfirm:
        'Êtes-vous sûr de vouloir effacer tous les messages? Cette action ne peut pas être annulée.',
      closeButton: 'Fermer le chat',
    },
    errors: {
      connection: 'Erreur de connexion',
      connectionDescription:
        'Il y a eu un problème de connexion au service de chat.',
      lostConnection: 'Connexion perdue avec le service de chat.',
      tryAgain: 'Réessayer',
      reconnect: 'Se reconnecter',
      submitFailed: "Échec de l'envoi du message",
      generic: 'Une erreur est survenue',
      sendFailed: "Échec de l'envoi du message",
      networkError: 'Erreur réseau',
      serverError: 'Erreur du serveur',
      timeout: "Délai d'attente dépassé",
      emptyMessage: 'Veuillez entrer un message',
      messageTooLong: 'Message trop long (max {{max}} caractères)',
      disabled: "L'entrée est actuellement désactivée",
    },
    windowChat: {
      title: 'Mode Chat en Fenêtre',
      description:
        'La fenêtre de chat apparaîtra dans le coin inférieur droit de votre écran.',
    },
    custom: {
      title: 'Connectez-vous à Votre Workflow n8n',
      webhookLabel: 'Entrez votre URL de Webhook n8n :',
      webhookDescription:
        'Cette URL se connecte à votre workflow n8n pour la fonctionnalité de chat IA.',
      submitButton: 'Connecter & Démarrer le Chat',
      exampleUrl:
        'URL exemple : https://n8n.example.com/webhook/your-workflow-id/chat',
      changeUrlButton: 'Changer URL',
    },
  },
  i18n: {
    direct: {
      title: 'Assistant IA',
      subtitle: 'Votre assistant IA',
      footer: 'Propulsé par n8n',
      inputPlaceholder: 'Tapez votre message...',
      helpMessage: "Bonjour! Comment puis-je vous aider aujourd'hui?",
    },
  },
  validation: {
    url: {
      invalid: 'Veuillez entrer une URL valide',
    },
  },
};
