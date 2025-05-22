export default {
  welcome: 'Bienvenido',
  theme: {
    toggle: 'Cambiar tema',
    light: 'Claro',
    dark: 'Oscuro',
    system: 'Sistema',
  },
  common: {
    dashboard: 'Panel de control',
    signOut: 'Cerrar sesión',
    saveChanges: 'Guardar cambios',
    saving: 'Guardando...',
    cancel: 'Cancelar',
    backToHome: 'Volver al inicio',
    tryAgain: 'Intentar de nuevo',
  },
  user: {
    profilePicture: 'Foto de perfil',
    upload: 'Subir',
    delete: 'Eliminar',
    uploading: 'Subiendo...',
    profilePictureUploaded: 'Foto de perfil actualizada',
    profilePictureUploadedDescription:
      'Tu foto de perfil ha sido actualizada correctamente.',
    profilePictureUploadError: 'Error al subir',
    profilePictureUploadErrorDescription:
      'Ha ocurrido un error al subir tu foto de perfil.',
    profilePictureDeleted: 'Foto de perfil eliminada',
    profilePictureDeletedDescription:
      'Tu foto de perfil ha sido eliminada correctamente.',
    profilePictureDeleteError: 'Error al eliminar',
    profilePictureDeleteErrorDescription:
      'Ha ocurrido un error al eliminar tu foto de perfil.',
    fileTooLarge: 'Archivo demasiado grande',
    fileTooLargeDescription: 'La imagen debe ser menor a 5MB.',
    invalidFileType: 'Tipo de archivo inválido',
    invalidFileTypeDescription:
      'Por favor sube un archivo de imagen JPEG, PNG, GIF o WebP.',
    fileUploaded: 'Archivo subido',
    fileUploadedDescription: 'Tu archivo ha sido subido correctamente.',
    fileUploadError: 'Error al subir',
    fileUploadErrorDescription: 'Ha ocurrido un error al subir tu archivo.',
    fileDeleted: 'Archivo eliminado',
    fileDeletedDescription: 'Tu archivo ha sido eliminado correctamente.',
    fileDeleteError: 'Error al eliminar',
    fileDeleteErrorDescription: 'Ha ocurrido un error al eliminar tu archivo.',
    profileTitle: 'Tu perfil',
    profileInformation: 'Información del perfil',
    editProfileInformation: 'Ver y editar tu información de perfil',
    uploadProfilePicture: 'Subir tu foto de perfil',
    firstName: 'Nombre',
    lastName: 'Apellido',
    email: 'Correo electrónico',
    phoneNumber: 'Número de teléfono',
    firstNamePlaceholder: 'Ingresa tu nombre',
    lastNamePlaceholder: 'Ingresa tu apellido',
    phoneNumberPlaceholder: 'Ingresa tu número de teléfono',
    update: {
      success: 'Usuario actualizado correctamente',
      error: 'Error al actualizar usuario',
    },
  },
  userMenu: {
    upgradePlan: 'Actualizar tu plan',
    managePlan: 'Gestionar tu plan',
    account: 'Cuenta',
    notifications: 'Notificaciones',
    logOut: 'Cerrar sesión',
  },
  payments: {
    paymentSuccessful: '¡Pago exitoso!',
    thankYouForPurchase: '¡Gracias por tu compra!',
    checkYourEmail: 'Revisa tu correo para el recibo del pago.',
    paymentCanceled: 'Pago cancelado',
    paymentCanceledMessage: 'Tu pago fue cancelado. No se realizaron cargos.',
    needHelp: '¿Necesitas ayuda? Contacta a nuestro equipo de soporte.',
  },
  subscriptions: {
    choosePlan: 'Elige el plan adecuado para ti',
    noPlans: 'No hay planes de suscripción disponibles en este momento.',
    subscribe: 'Suscribirse',
    manageSubscription: 'Gestionar suscripción',
    recommended: 'RECOMENDADO',
    includes: 'Incluye:',
    basicFeatures: 'Características básicas incluidas',
    billedMonthly: 'Facturado mensualmente',
    billedAnnually: 'Facturado anualmente',
    subscribeSubtext:
      'Obtén acceso a todas nuestras características premium con opciones de suscripción flexibles',
  },
  errors: {
    errorOccurred: 'Ha ocurrido un error',
    genericError: 'Algo salió mal. Por favor intenta de nuevo.',
    notFound: 'No encontrado',
    notFoundDescription: 'La página que buscas no existe.',
    unauthorized: 'No autorizado',
    unauthorizedDescription:
      'No tienes autorización para acceder a esta página.',
    exportDiagramPng: 'Error al exportar diagrama como PNG',
    copyXml: 'Error al copiar XML',
    xmlParsing: 'Error al procesar diagrama BPMN',
    cannotGetCanvas: 'No se pudo obtener el contexto del canvas',
    cannotCreateBlob: 'No se pudo crear el blob',
  },
  auth: {
    title: {
      signIn: 'Inicia sesión en tu cuenta',
      signUp: 'Crear una cuenta',
      forgotPassword: 'Restablecer tu contraseña',
      resetPassword: 'Crear nueva contraseña',
    },
    email: {
      label: 'Correo electrónico',
      description: 'Por favor ingresa tu dirección de correo electrónico.',
      placeholder: 'Ingresa tu correo',
    },
    password: {
      label: 'Contraseña',
      description: 'Por favor ingresa tu contraseña.',
      placeholder: 'Ingresa tu contraseña',
      newPassword: 'Nueva contraseña',
      confirmPassword: 'Confirmar contraseña',
    },
    activationCode: {
      label: 'Código de activación',
      description: 'Por favor ingresa tu código de activación si tienes uno.',
      placeholder: 'Ingresa el código de activación',
    },
    forgotPassword: {
      link: '¿Olvidaste tu contraseña?',
      description:
        'Ingresa tu dirección de correo y te enviaremos un enlace para restablecer tu contraseña.',
      success: 'Revisa tu correo',
      successDescription:
        'Si existe una cuenta para este correo, hemos enviado instrucciones para restablecer la contraseña.',
      error: 'Error al solicitar restablecimiento de contraseña',
    },
    resetPassword: {
      description: 'Por favor ingresa una nueva contraseña para tu cuenta.',
      success: 'Contraseña restablecida exitosamente',
      successDescription:
        'Tu contraseña ha sido restablecida. Ya puedes iniciar sesión con tu nueva contraseña.',
      invalidToken: 'Token inválido o expirado',
      invalidTokenDescription:
        'El enlace de restablecimiento de contraseña es inválido o ha expirado. Por favor solicita uno nuevo.',
    },
    processing: 'Procesando...',
    buttons: {
      signIn: 'Iniciar sesión',
      signUp: 'Registrarse',
      toggleToSignIn: '¿Ya tienes una cuenta? Iniciar sesión',
      toggleToSignUp: '¿Necesitas una cuenta? Registrarse',
      resetPassword: 'Restablecer contraseña',
      sendResetLink: 'Enviar enlace de restablecimiento',
      backToLogin: 'Volver al inicio de sesión',
    },
    signUp: {
      success: '¡Registro exitoso!',
      error: 'Error al registrarse',
    },
    signIn: {
      success: '¡Inicio de sesión exitoso!',
      error: 'Error al iniciar sesión',
    },
    signOut: {
      success: '¡Cierre de sesión exitoso!',
      error: 'Error al cerrar sesión',
    },
  },
  s3: {
    fileUpload: {
      success: 'Archivo subido correctamente',
      error: 'Error al subir archivo',
    },
    fileDelete: {
      success: 'Archivo eliminado correctamente',
      error: 'Error al eliminar archivo',
    },
    fileConfirm: {
      success: 'Archivo confirmado correctamente',
      error: 'Error al confirmar archivo',
    },
  },
  stripe: {
    checkoutSession: {
      success: '¡Sesión de checkout creada correctamente!',
      error: 'Error al crear sesión de checkout',
    },
    customerPortalSession: {
      success: '¡Sesión del portal de cliente creada correctamente!',
      error: 'Error al crear sesión del portal de cliente',
    },
  },
  // Chat related translations
  header: {
    chatLink: 'Chat',
  },
  chat: {
    fullscreenMode: 'Modo pantalla completa',
    windowMode: 'Modo ventana',
    title: 'Asistente IA',
    footer: 'Desarrollado por Acqua',
    bubble: {
      text: 'Chat con IA',
    },
    status: {
      sending: 'Enviando...',
    },
    input: {
      placeholder: 'Mensaje al asistente IA...',
      sendButton: 'Enviar mensaje',
      label: 'Entrada de chat',
    },
    messages: {
      helpMessage: '¿Cómo puedo ayudarte hoy?',
      welcome: 'Bienvenido',
      thinking: 'Pensando...',
      you: 'Tú',
      assistant: 'Asistente',
      label: 'Mensajes del chat',
    },
    header: {
      newChat: 'Nuevo chat',
      clearConfirm:
        '¿Estás seguro de que quieres borrar todos los mensajes? Esta acción no se puede deshacer.',
      closeButton: 'Cerrar chat',
    },
    errors: {
      connection: 'Error de conexión',
      connectionDescription: 'Hubo un problema conectando al servicio de chat.',
      lostConnection: 'Se perdió la conexión al servicio de chat.',
      tryAgain: 'Intentar de nuevo',
      reconnect: 'Reconectar',
      submitFailed: 'Error al enviar mensaje',
      generic: 'Algo salió mal',
      sendFailed: 'Error al enviar mensaje',
      networkError: 'Error de red',
      serverError: 'Error del servidor',
      timeout: 'Tiempo de espera agotado',
      emptyMessage: 'Por favor ingresa un mensaje',
      messageTooLong: 'Mensaje demasiado largo (máximo {{max}} caracteres)',
      disabled: 'La entrada está deshabilitada actualmente',
    },
    windowChat: {
      title: 'Modo chat en ventana',
      description:
        'La ventana de chat aparecerá en la esquina inferior derecha de tu pantalla.',
    },
    custom: {
      title: 'Conecta a tu flujo de trabajo n8n',
      webhookLabel: 'Ingresa tu URL de webhook n8n:',
      webhookDescription:
        'Esta URL se conecta a tu flujo de trabajo n8n para la funcionalidad de chat IA.',
      submitButton: 'Conectar e iniciar chat',
      exampleUrl:
        'URL de ejemplo: https://n8n.example.com/webhook/your-workflow-id/chat',
      changeUrlButton: 'Cambiar URL',
    },
    sidebar: {
      title: 'Historial de chat',
      newChat: 'Nuevo chat',
      delete: 'Eliminar',
      conversations: 'conversación',
      conversationsPlural: 'conversaciones',
      forThisWebhook: 'para este webhook',
    },
  },
  i18n: {
    direct: {
      title: 'Asistente IA',
      subtitle: 'Tu asistente IA',
      footer: 'Desarrollado por n8n',
      inputPlaceholder: 'Pregúntame...',
      closeButtonTooltip: 'Cerrar chat',
      helpMessage: '¿Cómo puedo ayudarte hoy?',
      initialMessage: 'Estoy aquí para ayudarte. ¿Qué puedo hacer por ti hoy?',
    },
    custom: {
      title: 'Asistente IA',
      subtitle: 'Integración de flujo de trabajo personalizado',
      footer: 'Desarrollado por n8n',
      inputPlaceholder: 'Escribe tu mensaje aquí...',
      closeButtonTooltip: 'Cerrar chat',
      helpMessage: '¿Cómo puedo ayudarte hoy?',
    },
  },
  direct: {
    title: 'Modo de acceso directo',
    description:
      'Estás conectado a un asistente IA dedicado con un webhook preconfigurado.',
    features: {
      feature1: 'No se requiere configuración',
      feature2: 'Acceso instantáneo al asistente',
      feature3: 'Usando un flujo de trabajo preconfigurado',
    },
  },
  footer: {
    copyright: 'Acqua AI. Todos los derechos reservados.',
  },
  bpmn: {
    diagram: 'Diagrama BPMN',
    xml: 'XML BPMN',
    showXml: 'Mostrar XML',
    showDiagram: 'Mostrar diagrama',
    exportPng: 'Exportar como PNG',
    copyXml: 'Copiar XML',
    loadingDiagram: 'Cargando diagrama...',
    diagramError: 'Error en el diagrama',
  },
} as const;
