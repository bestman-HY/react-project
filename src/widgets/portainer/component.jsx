import { useTranslation } from "next-i18next";

import Container from "components/services/widget/container";
import Block from "components/services/widget/block";
import useWidgetAPI from "utils/proxy/use-widget-api";

export default function Component({ service }) {
  const { t } = useTranslation();

  const { widget } = service;

  const { data: containersData, error: containersError } = useWidgetAPI(widget, "docker/containers/json", {
    all: 1,
  });

  if (containersError) {
    return <Container error={t("widget.api_error")} />;
  }

  if (!containersData) {
    return (
      <Container>
        <Block label={t("portainer.running")} />
        <Block label={t("portainer.stopped")} />
        <Block label={t("portainer.total")} />
      </Container>
    );
  }

  if (containersData.error) {
    return <Container error={t("widget.api_error")} />;
  }

  const running = containersData.filter((c) => c.State === "running").length;
  const stopped = containersData.filter((c) => c.State === "exited").length;
  const total = containersData.length;

  return (
    <Container>
      <Block label={t("portainer.running")} value={running} />
      <Block label={t("portainer.stopped")} value={stopped} />
      <Block label={t("portainer.total")} value={total} />
    </Container>
  );
}
