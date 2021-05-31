import {app} from "./App";
import {sequelize} from "./utils/sequelize.util";

try {
  (async () => {
    await sequelize.sync({force: false});
    app.start();
  })();
} catch (e) {
  app.error(e);
}
