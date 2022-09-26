import useSWR from "swr";
import { useTranslation } from "next-i18next";

import Widget from "components/services/widgets/widget";
import Block from "components/services/widgets/block";
import { formatProxyUrl } from "utils/proxy/api-helpers";

export default function Component({ service }) {
  const { t } = useTranslation();

  const config = service.widget;

  const { data: statsData, error: statsError } = useSWR(formatProxyUrl(config, `status`));

  if (statsError) {
    return <Widget error={t("widget.api_error")} />;
  }

  if (!statsData) {
    return (
      <Widget>
        <Block label={t("strelaysrv.numActiveSessions")} />
        <Block label={t("strelaysrv.numConnections")} />
        <Block label={t("strelaysrv.bytesProxied")} />
      </Widget>
    );
  }

  return (
    <Widget>
      <Block
        label={t("strelaysrv.numActiveSessions")}
        value={t("common.number", { value: statsData.numActiveSessions })}
      />
      <Block label={t("strelaysrv.numConnections")} value={t("common.number", { value: statsData.numConnections })} />
      <Block label={t("strelaysrv.dataRelayed")} value={t("common.bytes", { value: statsData.bytesProxied })} />
      <Block
        label={t("strelaysrv.transferRate")}
        value={t("common.bitrate", { value: statsData.kbps10s1m5m15m30m60m[5] })}
      />
    </Widget>
  );
}
