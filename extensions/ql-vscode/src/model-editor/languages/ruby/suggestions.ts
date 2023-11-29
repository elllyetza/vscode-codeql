import { BaseLogger } from "../../../common/logging";
import { DecodedBqrsChunk } from "../../../common/bqrs-cli-types";
import { ModelsAsDataLanguage } from "../models-as-data";
import {
  AccessPathSuggestionRow,
  AccessPathSuggestionDefinitionType,
} from "../../suggestions";
import { parseRubyMethodFromPath, rubyMethodSignature } from "./access-paths";

function isDefinitionType(
  value: string,
): value is AccessPathSuggestionDefinitionType {
  return Object.values(AccessPathSuggestionDefinitionType).includes(
    value as AccessPathSuggestionDefinitionType,
  );
}

export function parseAccessPathSuggestionsResults(
  bqrs: DecodedBqrsChunk,
  _modelsAsDataLanguage: ModelsAsDataLanguage,
  logger: BaseLogger,
): AccessPathSuggestionRow[] {
  return bqrs.tuples
    .map((tuple, index): AccessPathSuggestionRow | null => {
      const row = tuple.filter(
        (value): value is string => typeof value === "string",
      );

      if (row.length !== 5) {
        void logger.log(
          `Skipping result ${index} because it has the wrong length`,
        );
        return null;
      }

      const type = row[0];
      const methodName = parseRubyMethodFromPath(row[1]);
      const value = row[2];
      const details = row[3];
      const definitionType = row[4];

      if (!isDefinitionType(definitionType)) {
        void logger.log(
          `Skipping result ${index} because it has an invalid definition type`,
        );
        return null;
      }

      return {
        method: {
          packageName: "",
          typeName: type,
          methodName,
          methodParameters: "",
          signature: rubyMethodSignature(type, methodName),
        },
        value,
        details,
        definitionType,
      };
    })
    .filter(
      (suggestion): suggestion is AccessPathSuggestionRow =>
        suggestion !== null,
    );
}
