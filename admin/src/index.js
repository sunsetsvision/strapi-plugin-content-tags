import pluginPkg from "../../package.json";
import pluginId from "./pluginId";
import Initializer from "./components/Initializer";
import SelectorIcon from "./components/SelectorIcon";
import getTrad from "./utils/getTrad";
import addColumnToTableHook from "./hooks/contentManagerHooks/addColumnToTable";

const prefixPluginTranslations = (trad, pluginId) => {
  if (!pluginId) {
    throw new TypeError("pluginId can't be empty");
  }
  return Object.keys(trad).reduce((acc, current) => {
    acc[`${pluginId}.${current}`] = trad[current];
    return acc;
  }, {});
};

const name = pluginPkg.strapi.name;

export default {
  register(app) {
    app.customFields.register({
      name: "content-tags",
      pluginId,
      type: "text",
      icon: SelectorIcon,
      intlLabel: {
        id: getTrad("customField.label"),
        defaultMessage: "Tags",
      },
      intlDescription: {
        id: getTrad("customField.description"),
        defaultMessage: "Assign tags to entities",
      },
      components: {
        Input: async () => import("./components/SelectorField"),
      },
      options: {
        advanced: [
          {
            sectionTitle: {
              id: "global.settings",
              defaultMessage: "Settings",
            },
            items: [
              {
                name: "required",
                type: "checkbox",
                intlLabel: {
                  id: "form.attribute.item.requiredField",
                  defaultMessage: "Required field",
                },
                description: {
                  id: "form.attribute.item.requiredField.description",
                  defaultMessage:
                    "You won't be able to create an entry if this field is empty",
                },
              },
            ],
          },
        ],
      },
    });
    app.registerPlugin({
      id: pluginId,
      initializer: Initializer,
      isReady: false,
      name,
    });
  },

  bootstrap(app) {
    app.registerHook(
      "Admin/CM/pages/ListView/inject-column-in-table",
      addColumnToTableHook
    );
  },
  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return import(
          /* webpackChunkName: "translation-[request]" */ `./translations/${locale}.json`
        )
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};
