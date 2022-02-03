import React, { useCallback, useEffect } from "react";
import shortid from "shortid";
import { LayoutUtils, useListener } from "@deephaven/dashboard";
import MatPlotLibPanel from "./MatPlotLibPanel";
import MatPlotLibEvent from "./MatPlotLibEvent";

export const DashboardPlugin = ({ id, layout, registerComponent }) => {
  const handleOpen = useCallback(
    (title, makeModel, metadata, panelId = shortid.generate(), dragEvent) => {
      const config = {
        type: "react-component",
        component: MatPlotLibPanel.COMPONENT,
        props: {
          localDashboardId: id,
          id: panelId,
          metadata,
          makeModel,
        },
        title,
        id: panelId,
      };

      const { root } = layout;
      LayoutUtils.openComponent({ root, config, dragEvent });
    },
    [id, layout],
  );

  const handlePanelOpen = useCallback(
    ({ dragEvent, fetch, panelId = shortid.generate(), widget }) => {
      const { name } = widget;
      const metadata = { name };
      const makeModel = () =>
        fetch().then((response) => response.getDataAsBase64());
      const config = {
        type: "react-component",
        component: MatPlotLibPanel.COMPONENT,
        props: {
          localDashboardId: id,
          id: panelId,
          metadata,
          makeModel,
        },
        title: name,
        id: panelId,
      };

      const { root } = layout;
      LayoutUtils.openComponent({ root, config, dragEvent });
    },
    [id, layout],
  );

  useEffect(() => {
    const cleanups = [
      registerComponent(MatPlotLibPanel.COMPONENT, MatPlotLibPanel),
    ];

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [registerComponent]);

  useListener(layout.eventHub, MatPlotLibEvent.OPEN, handleOpen);
  useListener(layout.eventHub, "PanelEvent.OPEN", handlePanelOpen);

  return <></>;
};

DashboardPlugin.name = "@deephaven/matplotlib-js-plugin.DashboardPlugin";

export default DashboardPlugin;
