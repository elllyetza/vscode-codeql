import { CancellationToken } from "vscode";
import { ProgressCallback } from "../common/vscode/progress";
import { DatabaseItem } from "../databases/local-databases";
import { CoreCompletedQuery, QueryRunner } from "../query-server";
import { TeeLogger, showAndLogExceptionWithTelemetry } from "../common/logging";
import { QueryResultType } from "../query-server/new-messages";
import { extLogger } from "../common/logging/vscode";
import { telemetryListener } from "../common/vscode/telemetry";
import { redactableError } from "../common/errors";
import { basename } from "path";

type RunQueryOptions = {
  queryRunner: QueryRunner;
  databaseItem: DatabaseItem;
  queryPath: string;
  queryStorageDir: string;
  additionalPacks: string[];
  extensionPacks: string[] | undefined;
  progress: ProgressCallback;
  token: CancellationToken;
};

export async function runQuery({
  queryRunner,
  databaseItem,
  queryPath,
  queryStorageDir,
  additionalPacks,
  extensionPacks,
  progress,
  token,
}: RunQueryOptions): Promise<CoreCompletedQuery | undefined> {
  // Create a query run to execute
  const queryRun = queryRunner.createQueryRun(
    databaseItem.databaseUri.fsPath,
    {
      queryPath,
      quickEvalPosition: undefined,
      quickEvalCountOnly: false,
    },
    false,
    additionalPacks,
    extensionPacks,
    {},
    queryStorageDir,
    undefined,
    undefined,
  );

  const completedQuery = await queryRun.evaluate(
    progress,
    token,
    new TeeLogger(queryRunner.logger, queryRun.outputDir.logPath),
  );

  if (completedQuery.resultType !== QueryResultType.SUCCESS) {
    void showAndLogExceptionWithTelemetry(
      extLogger,
      telemetryListener,
      redactableError`Failed to run ${basename(queryPath)} query: ${
        completedQuery.message ?? "No message"
      }`,
    );
    return;
  }
  return completedQuery;
}
