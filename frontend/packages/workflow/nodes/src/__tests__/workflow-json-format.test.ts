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

import { describe, expect, it } from 'vitest';
import { VariableTypeDTO, ViewVariableType } from '@coze-workflow/base';

import { WorkflowJSONFormat } from '../workflow-json-format';

const createDocument = () =>
  ({
    getNodeRegister: () => ({
      meta: {
        nodeDTOType: '59',
      },
      variablesMeta: {
        outputsPathList: ['outputs'],
        inputsPathList: [],
      },
    }),
  }) as any;

describe('WorkflowJSONFormat', () => {
  it('preserves output schema after node submit already serialized dto outputs', () => {
    const formatter = new WorkflowJSONFormat();
    const json = {
      type: '59',
      data: {
        outputs: [
          {
            name: 'output',
            type: VariableTypeDTO.object,
            schema: [
              {
                name: 'genre_mode',
                type: VariableTypeDTO.string,
              },
            ],
          },
        ],
      },
    } as any;

    const result = formatter.formatNodeOnSubmit(
      json,
      createDocument(),
      {} as any,
    );

    expect(result.data.outputs).toEqual([
      {
        name: 'output',
        type: VariableTypeDTO.object,
        schema: [
          {
            name: 'genre_mode',
            type: VariableTypeDTO.string,
          },
        ],
      },
    ]);
  });

  it('still serializes view metas into dto outputs on submit', () => {
    const formatter = new WorkflowJSONFormat();
    const json = {
      type: '59',
      data: {
        outputs: [
          {
            key: 'root',
            name: 'output',
            type: ViewVariableType.Object,
            children: [
              {
                key: 'genre_mode',
                name: 'genre_mode',
                type: ViewVariableType.String,
              },
            ],
          },
        ],
      },
    } as any;

    const result = formatter.formatNodeOnSubmit(
      json,
      createDocument(),
      {} as any,
    );

    expect(result.data.outputs).toEqual([
      {
        name: 'output',
        type: VariableTypeDTO.object,
        schema: [
          {
            name: 'genre_mode',
            type: VariableTypeDTO.string,
            assistType: undefined,
            schema: undefined,
            readonly: undefined,
            required: undefined,
            description: undefined,
            defaultValue: undefined,
          },
        ],
        assistType: undefined,
        readonly: undefined,
        required: undefined,
        description: undefined,
        defaultValue: undefined,
      },
    ]);
  });
});
