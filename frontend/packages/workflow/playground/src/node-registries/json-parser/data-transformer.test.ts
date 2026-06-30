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
import {
  VariableTypeDTO,
  ViewVariableType,
  type OutputValueVO,
  type VariableMetaDTO,
} from '@coze-workflow/base/types';

import { normalizeJsonParserOutputs } from './normalize-outputs';

describe('json-parser data transformer', () => {
  it('preserves nested children when outputs are already view metas', () => {
    const outputs: OutputValueVO[] = [
      {
        key: 'root',
        name: 'story_params',
        type: ViewVariableType.Object,
        children: [
          {
            key: 'genre_mode',
            name: 'genre_mode',
            type: ViewVariableType.String,
          },
        ],
      },
    ];

    const result = normalizeJsonParserOutputs(outputs);

    expect(result?.[0]).toMatchObject({
      name: 'story_params',
      children: [
        {
          name: 'genre_mode',
          type: ViewVariableType.String,
        },
      ],
    });
  });

  it('still converts dto outputs into nested view metas', () => {
    const outputs: VariableMetaDTO[] = [
      {
        name: 'story_params',
        type: VariableTypeDTO.object,
        schema: [
          {
            name: 'genre_mode',
            type: VariableTypeDTO.string,
          },
        ],
      },
    ];

    const result = normalizeJsonParserOutputs(outputs);

    expect(result?.[0]).toMatchObject({
      name: 'story_params',
      children: [
        {
          name: 'genre_mode',
          type: ViewVariableType.String,
        },
      ],
    });
  });
});
