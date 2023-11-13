<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## 프로젝트 소개
- 건물 관리자와 입주사 직원들의 소통을 위한 건물편의 앱/웹
- 건물 유형과 기능에 따라 모듈화한 B2B SaaS 모델
- 공지, 일정, 민원, 설문조사, 입주카드, 공용시설, 관리비, 임직원 관리 기능 등으로 구성
- 6개의 건물, 약 1600명의 사용자가 사용하는 플랫폼

## 사용 기술
Backend
- Language: javascript(es6), typescript
- Framework: Express.js
- Database: MongoDB (Mongoose)
- Etc: git, nginx, tdd
    
Devops
- AWS (ec2, route53, s3, codecommit)

Collaboration
- Firebase token, FCM

## 문제 해결
- 특정 시간(예를 들어 회의실 예약 1시간 전, 설문조사 마감 1시간 전 등)에 예약 알림을 주는 기능을 구현하려고 했고, 이를 위해 agenda 스케줄러를 선택했습니다. agenda 스케줄러를 선택한 이유는 크게 두 가지였습니다. 첫째로, MongoDB 서버와의 통합을 통해 스케줄링 작업을 데이터베이스에 저장하고 추적하기 용이하게 만들수 있었습니다. 둘째로, 서버를 재시작하더라도 실행 중인 스케줄러가 유지된다는 점이 소개되어 있었습니다. 그러나 실제로 서버를 재시작하는 테스트를 진행하면서 스케줄러가 동작하지 않는 문제점을 발견했습니다. 이 문제의 원인을 파악하기 위해 스케줄러 등록 코드를 변경하거나 agenda 자체 옵션을 조절해보았지만 해결되지 않았습니다. 이 문제가 사용자들 사이에서 공통적으로 발생하고 있다는 것을 알게되었고, agenda 스케줄러의 라이브러리 기능으로는 서버 재시작 시 스케줄러가 유지되지 않는다는 사실을 알게 되었습니다. 이에 따라 저는 다른 방식으로 문제에 접근하기로 결정했습니다. 서버가 재시작될 때 아직 예정된 스케줄러만을 다시 동작시키는 방법을 고려하였고, agendaJobs의 data 컬럼에 스케줄링 작업에 대한 자세한 정보와 동작 내용을 기록하였습니다. 그런 다음, 서버가 재시작될 때 agendaJobs의 lastfinishedAt 값이 null인 (아직 실행되지 않은) 스케줄러들을 식별하고, 해당 스케줄러들에 대해서 data 컬럼을 기반으로 스케줄러를 다시 실행하도록 구현했습니다. 이렇게 함으로써 서버가 재시작되더라도 스케줄러들이 정상적으로 작동할 수 있도록 구현했습니다.
- danfojs를 사용하여 엑셀 데이터 처리를 수행했습니다. 제가 파이썬에서 데이터 핸들링을 위해 주로 사용하는 라이브러리인 pandas와 유사한 기능을 제공하기 때문에 danfojs를 선택했습니다. 그러나 danfojs를 사용하면서 다음과 같은 문제점을 발견했습니다. 첫째로, danfojs는 TensorFlow를 사용하기 때문에 서버를 실행할 때마다 다음과 같은 경고 메시지가 표시되었습니다. "I tensorflow/core/platform/cpu_feature_guard.cc:151] This TensorFlow binary is optimized with oneAPI Deep Neural Network Library (oneDNN) to use the following CPU instructions in performance-critical operations: AVX2 FMA. To enable them in other operations, rebuild TensorFlow with the appropriate compiler flags." 이로 인해 danfojs를 사용할 때 시스템의 CPU 기능을 최적으로 활용하지 못할 수 있다는 우려가 있었습니다. 둘째로, danfojs 라이브러리 자체가 38.5MB로 상당히 무거웠습니다. 이로 인해 프로젝트의 용량이 불필요하게 커지고, 성능에도 영향을 미칠 수 있었습니다. 셋째로 csv utf-8 형식의 파일에 대해 인코딩을 처리하는 데 어려움을 겪었습니다. 이로 인해 데이터의 인코딩 문제를 처리하는 데 추가적인 작업이 필요했습니다. 위와 같은 이유로 danfojs 대신 xlsx 라이브러리로 전환 작업을 진행하였습니다. xlsx는 tensorflow를 사용하지 않았고, 라이브러리가 7.5MB로 가벼웠고, 인코딩 처리를 자동으로 수행해주어서 danfojs와는 다른 방식으로 구현하였음에도 불구하고 위의 문제를 모두 해결할 수 있었습니다. 이러한 경험을 토대로 라이브러리 선택에 대한 중요한 고려 사항을 배웠으며, 프로젝트의 성능과 효율성을 높이기 위해 항상 적절한 도구를 선택해야 한다는 것을 깨달았습니다.
- 관리비 수납 기능에서는 MongoDB 설계 방식 중 One-To-Few 방식으로 관리비 데이터를 구성하고 있었습니다. 그러나 실제 서비스 운영 중에 관리비 조회 기능을 사용할 때 약 10초가 소요된다는 문제점을 발견하였습니다. 이 문제는 One-To-Few 방식으로 구현했고, 반복문을 통해 데이터를 처리했기 때문이었습니다. 건물에 약 2000개 이상의 단위 데이터가 있어서 이러한 처리 방식으로는 처리 시간이 지연되었습니다. 서비스 운영 전에는 대용량 데이터 처리에 대한 고려를 하지 못했던 것이 문제였습니다. 그러나 이 문제는 핫픽스 요청으로 신속한 대응이 필요했습니다. 따라서 관리비 상세항목 데이터로 구성된 테이블을 추가적으로 만들어 데이터 구조를 One-To-Many 방식으로 변경하고, 관련된 api에서 반복문을 사용하는 코드를 모두 MongoDB의 aggregate 쿼리문으로 변경했습니다. 이러한 변경을 통해 관리비 조회 기능의 처리 시간을 1초로 대폭 줄일 수 있었습니다. 이로써 빠른 대응과 데이터 처리 효율성을 확보했고, 사용자 경험을 향상시킬 수 있었습니다.
- 기존의 웹 구현은 SSG(Static Site Generator) 방식으로 되어 있어 Nginx와의 연결 시 빌드 파일의 위치를 찾아서 연결하는 방식을 사용하고 있었습니다. 그러나 추가로 새로운 웹을 구현했을 때 SSR(Server-Side Rendering) 방식으로 적용했고, 웹 서버에 대한 지식 부족으로 어려움을 겪었습니다. 기존에는 Nginx 설정에서 다음과 같이 빌드 파일의 경로를 지정하고 index 파일을 직접 지정하는 것으로 작성되어 있었습니다. 'root /빌드/파일의/경로; index index.html index.htm;' 이렇게 설정하면 빌드 파일의 경로를 지정하고 index 파일을 지정하는 것으로 문제를 해결할 수 있을 것으로 생각했습니다. 그래서 빌드 파일의 위치를 계속 찾아보는 것으로 문제를 해결하려 했습니다. 리서치 결과 SSG와 SSR 방식에 대해 알게 되었고, 이 두 방식의 구조가 서로 다르다는 사실을 깨달았습니다. 초기에는 웹 서버와의 연결을 어떻게 처리해야 할지 헷갈렸는데, 결국 웹 서버를 별도로 실행하고 해당 포트 번호에 따라 Nginx 설정에서 proxy_pass를 사용하는 방식으로 문제를 해결할 수 있었습니다. 'proxy_pass http://localhost:포트번호;' 이를 통해 SSR 방식을 사용한 웹 서버와 Nginx 간의 연결을 성공적으로 구현할 수 있었습니다.
- 프로덕트 초기 모델이 만들어진 후, 시간이 지남에 따라 각 건물이 서비스하는 기능이 서로 다르며 비슷한 기능이라도 세부적인 요구 사항이 조금씩 다르게 나타났습니다. 처음에는 이러한 다양한 건물 특성을 고려하여 프론트엔드 코드에서 각 건물에 대해 하드코딩된 분기점을 만들어서 특수 처리를 했습니다. 그러나 이러한 방식으로 진행하다 보니 분기점이 점점 많아졌고, 프로덕트의 본질이 B2B 보다는 SI 성향을 띄게 된다고 생각했습니다. 이로 인해 프로덕트는 점점 복잡해져 유지보수 비용 측면에서 문제가 발생할 것으로 판단했습니다. 이에 따라 유연성과 확장성을 높이기 위해 모듈화를 도입해야 한다는 의견을 제시했습니다. 결과적으로 프론트엔드 코드에서 하드코딩 부분을 제거하고, 서버에서 제공되는 데이터 값에 따라 각 건물의 특성이 동적으로 결정되는 모듈화 및 커스터마이징 기능을 구현하게 되었습니다. 이로써, 각 건물에 대한 설정 및 기능 추가가 서버나 웹 업데이트 없이 데이터 변경만으로 손쉽게 조절할 수 있게 되었습니다.

## 회고
- 백엔드 개발의 모든 단계를 전담하여 진행한 첫 프로젝트였습니다. 이를 통해 다양한 경험을 얻을 수 있었습니다. 프로젝트 내용은 AWS 서버 설정, 백엔드 서버 구축, 데이터베이스 설계, API 작성부터 시작해서 푸시 알림, 스케줄러, 메시지 전송, 파이어베이스를 활용한 OAuth2 인증 구현, 파일 업로드, 외부 API 연동, 업무 자동화, 그리고 AWS 인프라 구축 등 다양한 작업을 포함하고 있었습니다. 이러한 작업들은 모두 처음 시도하는 일들이었기 때문에 문제 해결을 위해 구글링을 통한 학습과 수많은 시행착오를 겪으면서 기술 습득과 문제 해결 능력을 키울 수 있었습니다.
- 프로젝트는 항상 기한이 있었기 때문에 빠른 진행이 필수적이었습니다. 그래서 프로젝트는 빠른 개발에 초점을 맞춰 진행되었습니다. 이로 인해 프로젝트의 설계, 코드 구조, 기술 스택 등에서 아쉬운 부분이 있을 수 있었지만, 그 당시에는 회사의 목표를 달성하기 위해 최선을 다한 것으로 생각합니다. 특히 처음 접하는 기술을 빠르게 적용하는 능력을 기를 수 있었고, 이를 위한 노하우를 습득하였습니다. 또한 기한을 준수하기 위해 업무의 우선순위를 결정하고 개인 일정을 효율적으로 관리하는 방법을 배울 수 있었습니다.
프로젝트 중에는 새로운 기능이 자주 도입되었고, 기존 기능 중에서도 정책이 변경되는 상황이 빈번하게 발생했습니다. 이를 위해 초기에 설계한 구조를 유연하게 확장하거나 개선하는 데 많은 노력을 기울였습니다. 새로운 기능 추가 및 변경 사항을 효과적으로 수용할 수 있도록 구조를 설계하고, 하드코딩이 아닌 동적으로 조절 가능한 방식으로 구현하려 노력했습니다. 이러한 노력을 통해 프로젝트의 유지보수 비용을 절감할 수 있었습니다.
- 스타트업 환경에서는 방향성과 정책 결정에 대한 다양한 토론과 의사결정에 직접 참여할 기회가 많았습니다. 프로젝트의 우선순위 결정부터 기획과 디자인과의 소통, 기능 확장 또는 축소 등 다양한 의사결정에 참여했습니다. 이를 통해 제품에 대한 본질적인 고민을 하고 항상 최선의 결정을 내리기 위해 노력했습니다.
