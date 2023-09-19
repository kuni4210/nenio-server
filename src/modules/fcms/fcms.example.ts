// import { Injectable } from '@nestjs/common';
// import { Cron } from '@nestjs/schedule';

// @Injectable()
// export class MyScheduledService {
//   // 동적인 Cron 표현식을 사용하여 스케줄 설정
//   @Cron(() => {
//     // 여기에서 원하는 로직을 사용하여 동적으로 Cron 표현식을 생성
//     const targetDate = new Date('2023-08-07T12:30:00Z'); // 원하는 날짜와 시간 설정
//     const currentDate = new Date();

//     if (currentDate >= targetDate) {
//       // 이미 지난 날짜라면 다음 실행 시간을 설정
//       const nextTargetDate = new Date(targetDate);
//       nextTargetDate.setFullYear(nextTargetDate.getFullYear() + 1); // 예를 들어 1년 후로 설정
//       return `0 30 12 ${nextTargetDate.getDate()} ${nextTargetDate.getMonth() + 1} ? ${nextTargetDate.getFullYear()}`;
//     } else {
//       // 아직 지나지 않은 날짜라면 원하는 날짜와 시간을 설정
//       return `0 30 12 ${targetDate.getDate()} ${targetDate.getMonth() + 1} ? ${targetDate.getFullYear()}`;
//     }
//   })
//   handleCron() {
//     // 이 메서드는 동적으로 계산된 Cron 표현식에 따라 실행됩니다.
//     // 원하는 작업을 수행합니다.
//   }

//   @Cron('0 30 12 7 8 ? 2023')
//   handleCron2() {}
// }
