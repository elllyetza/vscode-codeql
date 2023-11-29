import * as React from "react";
import { useMemo } from "react";
import { MethodRow } from "./MethodRow";
import { canMethodBeModeled, Method } from "../../model-editor/method";
import { ModeledMethod } from "../../model-editor/modeled-method";
import { sortMethods } from "../../model-editor/shared/sorting";
import { HiddenMethodsRow } from "./HiddenMethodsRow";
import { ModelEditorViewState } from "../../model-editor/shared/view-state";
import { ScreenReaderOnly } from "../common/ScreenReaderOnly";
import { DataGrid, DataGridCell } from "../common/DataGrid";
import { AccessPathSuggestionOptions } from "../../model-editor/suggestions";

export const SINGLE_MODEL_GRID_TEMPLATE_COLUMNS =
  "0.5fr 0.125fr 0.125fr 0.125fr 0.125fr";
export const MULTIPLE_MODELS_GRID_TEMPLATE_COLUMNS =
  "0.5fr 0.125fr 0.125fr 0.125fr 0.125fr max-content";

export type ModeledMethodDataGridProps = {
  methods: Method[];
  modeledMethodsMap: Record<string, ModeledMethod[]>;
  modifiedSignatures: Set<string>;
  inProgressMethods: Set<string>;
  viewState: ModelEditorViewState;
  hideModeledMethods: boolean;
  revealedMethodSignature: string | null;
  accessPathSuggestions?: AccessPathSuggestionOptions;
  onChange: (methodSignature: string, modeledMethods: ModeledMethod[]) => void;
};

export const ModeledMethodDataGrid = ({
  methods,
  modeledMethodsMap,
  modifiedSignatures,
  inProgressMethods,
  viewState,
  hideModeledMethods,
  revealedMethodSignature,
  accessPathSuggestions,
  onChange,
}: ModeledMethodDataGridProps) => {
  const [methodsWithModelability, numHiddenMethods]: [
    Array<{ method: Method; methodCanBeModeled: boolean }>,
    number,
  ] = useMemo(() => {
    const methodsWithModelability = [];
    let numHiddenMethods = 0;
    for (const method of sortMethods(methods)) {
      const modeledMethods = modeledMethodsMap[method.signature] ?? [];
      const methodIsUnsaved = modifiedSignatures.has(method.signature);
      const methodCanBeModeled = canMethodBeModeled(
        method,
        modeledMethods,
        methodIsUnsaved,
      );

      if (methodCanBeModeled || !hideModeledMethods) {
        methodsWithModelability.push({ method, methodCanBeModeled });
      } else {
        numHiddenMethods += 1;
      }
    }
    return [methodsWithModelability, numHiddenMethods];
  }, [hideModeledMethods, methods, modeledMethodsMap, modifiedSignatures]);

  const someMethodsAreVisible = methodsWithModelability.length > 0;

  const gridTemplateColumns = viewState.showMultipleModels
    ? MULTIPLE_MODELS_GRID_TEMPLATE_COLUMNS
    : SINGLE_MODEL_GRID_TEMPLATE_COLUMNS;

  return (
    <DataGrid gridTemplateColumns={gridTemplateColumns}>
      {someMethodsAreVisible && (
        <>
          <DataGridCell rowType="header">API or method</DataGridCell>
          <DataGridCell rowType="header">Model type</DataGridCell>
          <DataGridCell rowType="header">Input</DataGridCell>
          <DataGridCell rowType="header">Output</DataGridCell>
          <DataGridCell rowType="header">Kind</DataGridCell>
          {viewState.showMultipleModels && (
            <DataGridCell rowType="header">
              <ScreenReaderOnly>Add or remove models</ScreenReaderOnly>
            </DataGridCell>
          )}
          {methodsWithModelability.map(({ method, methodCanBeModeled }) => {
            const modeledMethods = modeledMethodsMap[method.signature] ?? [];
            const inputAccessPathSuggestions =
              accessPathSuggestions?.input?.[method.signature];
            const outputAccessPathSuggestions =
              accessPathSuggestions?.output?.[method.signature];
            return (
              <MethodRow
                key={method.signature}
                method={method}
                methodCanBeModeled={methodCanBeModeled}
                modeledMethods={modeledMethods}
                methodIsUnsaved={modifiedSignatures.has(method.signature)}
                modelingInProgress={inProgressMethods.has(method.signature)}
                viewState={viewState}
                revealedMethodSignature={revealedMethodSignature}
                inputAccessPathSuggestions={inputAccessPathSuggestions}
                outputAccessPathSuggestions={outputAccessPathSuggestions}
                onChange={onChange}
              />
            );
          })}
        </>
      )}
      <HiddenMethodsRow
        numHiddenMethods={numHiddenMethods}
        someMethodsAreVisible={someMethodsAreVisible}
        viewState={viewState}
      />
    </DataGrid>
  );
};
