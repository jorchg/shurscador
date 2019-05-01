const mapper = {
  getForumName: (forumId = 0) => {
    let forumName = '';
    switch(forumId) {
      case 2:
        forumName = 'General';
        break;
      case 17:
        forumName = 'Electrónica / Informática';
        break;
      case 82:
        forumName = 'Fotografía';
        break;
      case 23:
        forumName = 'Empleo / Emprendimiento';
        break;
      case 64:
        forumName = 'Taxis / VTCs';
        break;
      case 27:
        forumName = 'Viajes';
        break;
      case 15:
        forumName = 'Quedadas (KDD)';
        break;
      case 57:
        forumName = 'Inverforo';
        break;
      case 4:
        forumName = 'Forocoches';
        break;
      case 18:
        forumName = 'Competición';
        break;
      case 90:
        forumName = 'Eléctricos';
        break;
      case 20:
        forumName = 'Clásicos';
        break;
      case 65:
        forumName = 'Compra - venta clásicos';
        break;
      case 47:
        forumName = 'Monovolúmenes';
        break;
      case 21:
        forumName = '4X4 / Ocio';
        break;
      case 28:
        forumName = 'Modelismo';
        break;
      case 70:
        forumName = 'Compra - venta modelismo';
        break;
      case 76:
        forumName = 'Camiones / Furgones / Autobuses';
        break;
      case 48:
        forumName = 'Motos';
        break;
      case 80:
        forumName = 'Compra - venta motos';
        break;
      default:
        forumName = '';
        break;
    }
    return forumName;
  },
};

export default mapper;
