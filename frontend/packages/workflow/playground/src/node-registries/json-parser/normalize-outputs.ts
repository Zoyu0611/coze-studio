/*
 * Copyright 2025 coze-dev Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { variableUtils } from '@coze-workflow/variable/src/legacy/variable-utils';
import {
  type OutputValueVO,
  type VariableMetaDTO,
} from '@coze-workflow/base/types';

export const toOutputMeta = (
  output: VariableMetaDTO | OutputValueVO,
): OutputValueVO => {
  // Outputs have already been converted into view metas by the global workflow formatter.
  // Re-converting them here drops nested children for object outputs.
  if ('key' in output) {
    return { ...output };
  }

  return variableUtils.dtoMetaToViewMeta(output);
};

export const normalizeJsonParserOutputs = (
  outputs?: Array<VariableMetaDTO | OutputValueVO>,
): OutputValueVO[] | undefined => outputs?.map(toOutputMeta);
