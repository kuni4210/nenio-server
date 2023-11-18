## 프로젝트 소개
- 선택형 질문 기반의 소통을 간편하게 지원하는 커뮤니티 앱
- 데이터 구조: https://www.erdcloud.com/d/CtfGuXbAeLDgStj6H
- api 문서: http://3.39.10.120:3000/api

![image](https://github.com/kuni4210/nenio-server/assets/75457849/bc636b41-c619-4dd6-81dc-2dece6cf8bb8)
![image](https://github.com/kuni4210/nenio-server/assets/75457849/d6b7ecaa-8c01-4c0d-9b31-1d0bd1e32890)
![image](https://github.com/kuni4210/nenio-server/assets/75457849/e61507f6-2b23-406e-8b2a-1e9d0e0f7508)

## 사용 기술
Backend
- Language: javascript(es6), typescript
- Framework: Nest.js
- Database: MySQL (TypeORM)
- Etc: git
  
Devops
- AWS (ec2, s3)

Collaboration
- Firebase token

## 문제 해결
- 이 프로젝트는 특정 API의 동작 시 권한 확인 및 사용자 정보 조회를 위해 Firebase Authentication을 사용합니다.
이를 위해 처음에는 각 컨트롤러마다 Firebase 인증 코드를 직접 작성하여 관리했습니다. 이 방식은 권한 확인과 사용자 정보 활용을 위해 조회한 사용자의 유형(userType)을 확인하여 권한을 부여하고, 권한에 맞지 않은 경우 ForbiddenException 오류를 반환했습니다. 그러나 이 방식은 가독성이 좋지 않고, 사용자 권한 관리가 어려웠습니다. 이를 개선하기 위해 파이어베이스 인증 후 역할 기반의 권한 검사를 쉽게 수행할 수 있도록 Roles 데코레이터를 사용하여 역할 정보를 메타데이터로 설정하고, 파이어베이스 권한 확인 후 역할 정보를 확인하는 것을 FirebaseAuthGuard 모듈로 직접 구현했습니다. 개선 후 컨트롤러에 @Roles(UserRole.ADMIN); @UseGuards(FirebaseAuthGuard); 라고 작성하면 권한을 제한할 수 있게 되었습니다.
- 프로젝트에는 question, option, user 엔티티가 있습니다. 특정 사용자가 질문에 참여할 때, answer 엔티티에는 question과 option 그리고 user의 ID를 저장합니다. 처음 설계는 데이터 모니터링 관점에서 좋을 것 같았지만, 일반 질문 목록 조회나 본인이 참여한 질문 목록 조회 등을 작성할 때 answer 엔티티와의 조인이 추가로 필요하게 되어 비효율적으로 느껴졌습니다. 따라서 question과 user, 그리고 option과 user를 각각 연결하는 조인 테이블을 만드는 방향으로 설계를 개선하였고, 쿼리도 조인을 한번씩 줄이는 방향으로 수정할 수 있었습니다. 이러한 변경으로 인해 데이터베이스 쿼리를 더 효율적으로 작성하고, 조인 작업을 최소화하여 성능을 향상시킬 수 있습니다.

## 회고
- Nest.js는 평소에 큰 관심을 가지고 있던 프레임워크였고, 이번 프로젝트를 통해 처음으로 적용해 보게 되었습니다. 프로젝트를 진행하면서 Nest.js에 인상적인 부분이 많았습니다. 몇 가지 말씀드리자면 DI 구조를 사용하여 코드의 재사용성과 유지보수성을 높일 수 있었고, DTO를 사용하여 클라이언트와의 통신에서 발생할 수 있는 오류를 사전에 방지할 수 있었고, Swagger를 통해 API 문서를 자동으로 생성할 수 있어 개발 시간을 절약할 수 있었고, Jest를 기본 테스트 모듈로 제공하여 테스트 코드를 작성하는데 도움이 되었고, decorator를 직접 커스터마이징 할 수도 있었습니다. 그 중 가장 인상깊었던 점은 DTO와 swagger api 를 활용하여 API 문서를 자동으로 생성할 수 있다는 점이었습니다. 기존 업무에서는 외부에서 별도로 OpenAPI 문서를 작성해야 했는데, 이것을 활용하면 프로젝트 내에서 API 문서를 관리하면서도 손쉽게 업데이트할 수 있어 유지보수 측면에서 큰 이점을 얻을 수 있었습니다. 이것은 문서화 과정을 획기적으로 개선해 주었고, 앞으로의 프로젝트에서도 이를 잘 활용할 것 같습니다.
- 간단한 구조이지만 RDBMS를 활용하여 구조를 설계하고 API를 작성을 했습니다. TypeORM을 사용했는데 entity간의 관계 설정 과정에서 겪은 시행착오와 고민들이 있었습니다. '@JoinTable을 어떤 entity에 적용해야 하는가', '@ManyToMany를 두 entity 중 어느 곳에 적용해야 하는가', '@ManyToMany 관계에서 인수를 어떻게 작성해야 하는가' 등 많은 고민과 학습을 했고, 1차 개발 범위까지 완성할 수 있었습니다.


## 앞으로의 방향
- 프로젝트의 목표는 빠른 출시입니다.  프론트엔드 개발자들이 원활하게 API를 활용할 수 있도록 적극적으로 지원하며, 필요에 따라 기획이 변경될 때 빠르게 변경사항을 반영할 계획입니다.
- 현재 백엔드 작업이 기능적으로 문제는 없으나 부족한 부분이 몇 가지 있습니다. transaction 적용, API 명세서의 Response 타입 보완, 주석으로 코드 설명, tdd 작성, 알림 기능 추가 및 트랜잭션 적용, 도메인 구매 및 SSL 적용 순으로 작업이 진행될 것 같습니다. 그 이후에도 유연하게 대응할 수 있는 준비를 하고 있습니다. 기획에 따라 2차 개발이 진행 될 것같습니다.

