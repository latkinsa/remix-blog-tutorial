import SwaggerUI from "swagger-ui-react";
import styles from "swagger-ui-react/swagger-ui.css"
import { ClientOnly } from "remix-utils";

export default function SwaggerPage() {
  return <ClientOnly>{() => <SwaggerUI url="http://localhost:3000/cfs-openapi-001.yaml" tryItOutEnabled={false} />}</ClientOnly>;
}

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}