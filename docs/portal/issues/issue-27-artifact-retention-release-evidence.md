## Summary

staging deploy path は成立し、monitoring と rollback readiness も最低限そろったが、build artifact retention と release evidence の参照経路が workflow 上で十分に固定されていないと、known-good artifact の追跡と production 前の監査経路が弱いまま残る。

## Goal

artifact retention expectation、build provenance evidence、staging handoff evidence の最小実装を issue として固定し、Issue 18、Issue 25、Issue 26 の delivery path を release evidence の観点で前進させる。

## Task Contract

```text
タスク契約

メタデータ
- タスク ID: ISSUE-27
- タイトル: artifact retention と release evidence baseline を実装する
- 依頼者: repository owner
- 担当者: AI agent
- 対象アプリ: portal-web
- 対象環境: staging-first delivery operations
- 優先度: 中
- 先行条件: Issue 18 closed, Issue 25 closed, Issue 26 closed

目的
- 解決する問題: build artifact retention と release evidence の参照経路が曖昧なままだと、staging rollback や将来の production approval で、どの build を deploy したかの根拠が分散する
- 期待する価値: build run、artifact retention、staging handoff を GitHub Actions artifact と step summary から一貫して追えるようになり、known-good artifact の監査経路を強化できる

スコープ
- 含むもの: build artifact retention expectation の明文化、build evidence record の追加、staging deploy への source build provenance 反映、issue 記録への根拠整理
- 含まないもの: production deploy workflow の追加、artifact registry の新設、自動 rollback 実装、state locking 未決の解消
- 編集可能パス: .github/workflows/portal-build.yml, .github/workflows/portal-staging-deploy.yml, .github/workflows/README.md, docs/portal/issues/issue-27-artifact-retention-release-evidence.md
- 制限パス: infra/environments/production/, apps/portal-web/src/, closed issue records except explicit evidence references

受け入れ条件
- [ ] 条件 1: build artifact retention expectation が workflow か補助文書から読める
- [ ] 条件 2: build provenance と staging handoff の evidence path が追跡できる
- [ ] 条件 3: production-specific promotion depth を本 issue に混ぜない

実装計画
- 変更見込みファイル: .github/workflows/portal-build.yml, .github/workflows/portal-staging-deploy.yml, .github/workflows/README.md, docs/portal/issues/issue-27-artifact-retention-release-evidence.md
- アプローチ: 既存の build artifact upload と staging monitoring record を接続し、artifact retention と release evidence を GitHub Actions 標準 artifact / summary に寄せて最小差分で整える
- 採用しなかった代替案と理由: S3 や外部 storage を新しい artifact evidence store として導入する案は、staging-first baseline を超えて重くなるため採らない

検証計画
- 実行するテスト: workflow yaml review; get_errors on edited files
- 確認するログ/メトリクス: retention wording、build evidence record、staging handoff provenance、summary readability
- 失敗時の切り分け経路: .github/workflows/portal-build.yml、.github/workflows/portal-staging-deploy.yml、.github/workflows/README.md、docs/portal/issues/issue-18-ci-staging-foundation.md、docs/portal/issues/issue-25-staging-monitoring-hardening.md、docs/portal/issues/issue-26-rollback-readiness-implementation.md を照合し、artifact retention と evidence path のどこが不足しているかを分ける

リスクとロールバック
- 主なリスク: release evidence 強化の名目で production promotion workflow や別 storage 導入まで scope が膨らむこと
- 影響範囲: build workflow、staging deploy workflow、release evidence review
- 緩和策: retention expectation、build evidence record、staging handoff provenance の 3 点に限定する
- ロールバック手順: scope が広がった場合は build evidence record と README wording を優先して残し、その他は follow-on issue へ分離する
```

## Tasks

- [x] build artifact retention expectation を固定する
- [x] build evidence record を workflow に追加する
- [x] staging deploy から source build provenance を追えるようにする
- [x] release evidence の根拠と非対象を issue 記録へ残す

## Definition of Done

- [x] build artifact retention expectation が repeatable に参照できる
- [x] build run と staging handoff の evidence path が同じ GitHub Actions 文脈で追える
- [x] release evidence baseline と production-specific promotion depth が分離されている
- [x] 本 issue ファイルが変更対象と検証方針を追跡できる状態になっている

## Implementation Notes

現時点の実装記録は次の通り。

- [/.github/workflows/portal-build.yml](.github/workflows/portal-build.yml) に `portal-web-dist` と `portal-build-evidence` artifact の名前、および 14 日 retention baseline を追加し、build run ごとの artifact retention expectation を workflow 自体から読めるようにした
- [/.github/workflows/portal-build.yml](.github/workflows/portal-build.yml) に `portal-build-evidence.md` の生成、artifact upload、step summary 反映を追加し、run id、commit SHA、validation command、run URL を build provenance evidence として残せるようにした
- [/.github/workflows/portal-staging-deploy.yml](.github/workflows/portal-staging-deploy.yml) は `workflow_run` 時に `portal-build-evidence` artifact を取り込み、manual dispatch 時には同等の local build evidence を生成し、`staging-monitoring-record.md` に source build provenance を埋め込むようにした
- [/.github/workflows/README.md](.github/workflows/README.md) に build artifact retention と release evidence baseline の説明を追加し、staging-first の operator review path を summary と artifact 起点で読めるようにした

## Current Review Notes

- retention baseline は external storage や registry を足さず、GitHub Actions artifact retention-days と summary に寄せているため、staging-first の運用粒度を超えていない
- build evidence は raw logs の代替ではなく first-response provenance record として置いており、run id、commit SHA、validation command、run URL を最小セットに限定している
- staging monitoring record へ source build evidence snapshot を取り込むことで、artifact handoff と post-deploy verification が同じ review path に並ぶ構成にした
- production deploy workflow、production approval automation、external artifact registry は本 issue に含めず、release evidence baseline の最小構成に留めている

## Spot Check Evidence

Issue 27 の final review 前に、artifact retention と release evidence baseline が想定どおり整理されているかを spot check した結果を残す。

- build retention wording: [/.github/workflows/portal-build.yml](.github/workflows/portal-build.yml) は `portal-web-dist` と `portal-build-evidence` に対して 14 日 retention baseline を持つ
- build provenance record: [/.github/workflows/portal-build.yml](.github/workflows/portal-build.yml) は `portal-build-evidence.md` に run id、commit SHA、validation command、run URL、artifact 名を記録する
- staging handoff provenance: [/.github/workflows/portal-staging-deploy.yml](.github/workflows/portal-staging-deploy.yml) は source build evidence artifact の download と manual dispatch fallback を持ち、`staging-monitoring-record.md` に source build provenance を埋め込む
- release evidence wording: [/.github/workflows/README.md](.github/workflows/README.md) は build artifact retention baseline、build evidence artifact、staging monitoring record の関係を operator review path として説明している
- diagnostics: [/.github/workflows/portal-build.yml](.github/workflows/portal-build.yml)、[/.github/workflows/portal-staging-deploy.yml](.github/workflows/portal-staging-deploy.yml)、[/.github/workflows/README.md](.github/workflows/README.md)、[docs/portal/issues/issue-27-artifact-retention-release-evidence.md](docs/portal/issues/issue-27-artifact-retention-release-evidence.md) に editor diagnostics は出ていない

## Evidence Mapping Table

The tables below identify the evidence used for final checkbox review and should remain aligned with the checked state above.

For Issue 27 final review, the local issue record is the primary evidence source. [/.github/workflows/portal-build.yml](.github/workflows/portal-build.yml) provides the build retention and provenance implementation evidence, while [/.github/workflows/portal-staging-deploy.yml](.github/workflows/portal-staging-deploy.yml) provides the staging handoff and monitoring-path evidence. [/.github/workflows/README.md](.github/workflows/README.md) provides the operator-facing wording for the release evidence path.

### Task Mapping

| Checklist item                                                   | Primary evidence section                                                                                                                                                                                                             | Why this is the evidence                                                                                                            | Review state              |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `build artifact retention expectation を固定する`                | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, and [/.github/workflows/portal-build.yml](.github/workflows/portal-build.yml)                                                                                 | These sources show the artifact names and 14-day retention baseline are now recorded directly in the build workflow.                | Accepted for final review |
| `build evidence record を workflow に追加する`                   | `Implementation Notes`, `Spot Check Evidence`, and [/.github/workflows/portal-build.yml](.github/workflows/portal-build.yml)                                                                                                         | These sources show the build workflow now emits a provenance record artifact and summary entry.                                     | Accepted for final review |
| `staging deploy から source build provenance を追えるようにする` | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, and [/.github/workflows/portal-staging-deploy.yml](.github/workflows/portal-staging-deploy.yml)                                                               | These sources show the staging workflow now imports or synthesizes source build evidence and carries it into the monitoring record. | Accepted for final review |
| `release evidence の根拠と非対象を issue 記録へ残す`             | `Task Contract`, `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, and [docs/portal/issues/issue-27-artifact-retention-release-evidence.md](docs/portal/issues/issue-27-artifact-retention-release-evidence.md) | These sections keep both the evidence baseline and the excluded production-depth topics in one issue record.                        | Accepted for final review |

### Definition Of Done Mapping

| Checklist item                                                                      | Primary evidence section                                                                                                                                                                                                                          | Why this is the evidence                                                                                                  | Review state              |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `build artifact retention expectation が repeatable に参照できる`                   | `Implementation Notes`, `Spot Check Evidence`, [/.github/workflows/portal-build.yml](.github/workflows/portal-build.yml), and [/.github/workflows/README.md](.github/workflows/README.md)                                                         | These sources show both the workflow and the supporting README now describe the retention baseline consistently.          | Accepted for final review |
| `build run と staging handoff の evidence path が同じ GitHub Actions 文脈で追える`  | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, [/.github/workflows/portal-build.yml](.github/workflows/portal-build.yml), and [/.github/workflows/portal-staging-deploy.yml](.github/workflows/portal-staging-deploy.yml) | These sources show build provenance and staging monitoring evidence now stay attached to Actions artifacts and summaries. | Accepted for final review |
| `release evidence baseline と production-specific promotion depth が分離されている` | `Task Contract`, `Current Review Notes`, `Spot Check Evidence`, and [/.github/workflows/README.md](.github/workflows/README.md)                                                                                                                   | These sources keep production workflow depth and external registry changes out of scope for this issue.                   | Accepted for final review |
| `本 issue ファイルが変更対象と検証方針を追跡できる状態になっている`                 | `Task Contract`, `Implementation Notes`, `Spot Check Evidence`, and `Evidence Mapping Table` in [docs/portal/issues/issue-27-artifact-retention-release-evidence.md](docs/portal/issues/issue-27-artifact-retention-release-evidence.md)          | These sections preserve the scope, validation path, and evidence basis for the release evidence work.                     | Accepted for final review |

## Final Review Result

Final checkbox review completed against the latest wording in [docs/portal/issues/issue-27-artifact-retention-release-evidence.md](docs/portal/issues/issue-27-artifact-retention-release-evidence.md), with [/.github/workflows/portal-build.yml](.github/workflows/portal-build.yml) used as the primary build evidence implementation artifact and [/.github/workflows/portal-staging-deploy.yml](.github/workflows/portal-staging-deploy.yml) used as the primary staging handoff evidence artifact. [/.github/workflows/README.md](.github/workflows/README.md) was used as supporting evidence for the operator-facing review path.

| Checklist area               | Final judgment | Evidence basis                                                                                                                                                                                                                                                                               |
| ---------------------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Retention expectation        | Satisfied      | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, [/.github/workflows/portal-build.yml](.github/workflows/portal-build.yml), and [/.github/workflows/README.md](.github/workflows/README.md) confirm the 14-day artifact retention baseline is explicit.                |
| Build provenance evidence    | Satisfied      | `Implementation Notes`, `Spot Check Evidence`, and [/.github/workflows/portal-build.yml](.github/workflows/portal-build.yml) confirm the build workflow now emits a provenance record artifact and summary entry.                                                                            |
| Staging handoff traceability | Satisfied      | `Implementation Notes`, `Current Review Notes`, `Spot Check Evidence`, and [/.github/workflows/portal-staging-deploy.yml](.github/workflows/portal-staging-deploy.yml) confirm source build evidence is carried into the staging monitoring record.                                          |
| Scope control                | Satisfied      | `Task Contract`, `Current Review Notes`, and [/.github/workflows/README.md](.github/workflows/README.md) confirm production promotion workflow depth remains excluded.                                                                                                                       |
| Traceability                 | Satisfied      | `Task Contract`, `Implementation Notes`, `Spot Check Evidence`, and `Evidence Mapping Table` in [docs/portal/issues/issue-27-artifact-retention-release-evidence.md](docs/portal/issues/issue-27-artifact-retention-release-evidence.md) confirm the issue record tracks scope and evidence. |

## Process Review Notes

- Issue 27 は Issue 18、Issue 25、Issue 26 で揃った staging-first delivery path に対して、build artifact retention と release evidence の追跡線を追加する作業として整理した。
- explicit close approval は未受領であるため、本 issue は implementation complete かつ review-ready だが close は未実施である。
- 2026-03-08: repository owner より explicit close approval を受領。問題なしと合意。CLOSED に移行した。

## Current Status

- [/.github/workflows/portal-build.yml](.github/workflows/portal-build.yml) は artifact retention baseline と build evidence artifact を持つ
- [/.github/workflows/portal-staging-deploy.yml](.github/workflows/portal-staging-deploy.yml) は source build provenance を monitoring record に取り込む
- [/.github/workflows/README.md](.github/workflows/README.md) は build artifact retention と release evidence baseline を説明する
- **CLOSED** — 2026-03-08 に repository owner の close approval を受領し、クローズ済み

## Dependencies

- Issue 18
- Issue 25
- Issue 26
