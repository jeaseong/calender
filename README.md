# Burnfit 기업 과제입니다.

# 구현 사항

- bottom tab navigator 연결하기
- 라이브러리 없이 캘린더 스크린 만들기
- 이벤트에 따라 월 달력과 주 달력으로 변환하는 기능 만들기
- 좌우 스와이프 이벤트로 월 변경하기

<br/>

# 구현 내용

## bottom tab 연결하기

react native의 React navigation 라이브러리를 사용하여 tab을 만들었습니다.

기본적으로 native screen과 stack, bottom-tabs을 다운 받아서 기본적인 navigator를 만들었습니다.

https://user-images.githubusercontent.com/63990725/199796072-ef02205f-0b6e-4b08-a322-0500660cc22b.mp4

<br/>

## 캘린더 구현

<br/>

캘린더 구현의 핵심은 date 관리 입니다. 해당 연, 월, 일을 계산하여 출력하는 것을 구현하려고 합니다.

캘린더 구현에 필요한 라이브러리를 제한하기 위해 dayjs도 제외해서 date관련 로직들을 직접 구현했습니다.

<br/>

### 필요 함수

- 전 달의 마지막 날의 요일
- 전 달의 마지막 날
- 이번 달의 마지막 날의 요일
- 이번 달의 마지막 날
- Date 객체에서 반환되는 month를 영어로 반환하는 함수
- 오늘 날을 반환하는 함수 (year, month, day)

<br/>

### 날짜 출력

<br/>

전 달의 마지막 날의 요일과 날짜, 이번 달의 마지막 날의 요일과 날짜를 통해 월 별로 출력해야 하는 날짜를 배열에 담아, 한 줄에 7개씩 화면에 출력합니다.

### 날짜 클릭

<br/>

처음 시도는 클릭한 날짜와 상태에 저장된 날짜가 같으면 원 표시가 생기도록 구현을 하였습니다. 하지만 월이 다르거나 연도가 달라도 원 표시가 동시에 나타나는 에러가 발생했습니다.

캘린더 날짜를 담는 배열에 객체를 생성하여 연도, 월, 일을 담아 년, 월, 일 모두 비교해서 같은 경우만 원 표시가 가능하게 변경했습니다.

### 좌우 스크롤로 캘린더 월 변경하기

화면을 좌우로 밀 때 전 월과, 다음 월이 보일 수 있도록 구현했습니다. 밀어지는 효과를 주기 위해서 ScrollView에 총 3개의 캘린더 컴포넌트를 담았습니다.

슬라이드를 할 때 현재 달이 항상 가운데 컴포넌트에 위치하고 전 월과, 다음 월이 새롭게 렌더링 되도록 구현했습니다. ScrollView의 onMomentumScrollEnd를 활용하여 상태값을 변경했습니다. 

```tsx
const scrollToMiddleCalendar = () => {
    scrollRef.current?.scrollTo({
      x: layoutWidth - 40, // 40은 패딩 값
      animated: false,
    });
  };

  const scrollEffect = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const xValue = Math.floor(e.nativeEvent.contentOffset.x);
    const maxLayoutFloor = Math.floor(layoutWidth - 40) * 2;
    const prevMonth = getPrevDate(date);
    const nextMonth = getNextDate(date);

    if (!layoutWidth || layoutWidth === 1) {
      return;
    }
    if (scrollRef && scrollRef.current) {
      if (xValue === 0) {
        scrollToMiddleCalendar();
        setDate(prevMonth);
      } else if (xValue === maxLayoutFloor) {
        scrollToMiddleCalendar();
        setDate(nextMonth);
      }
    }
  };
  ```
<br/>
  ios 환경에서는 정상적으로 작동하지만 android 환경에서는 상태값이 3번 번경되는 문제가 있습니다. 정확히 어떤 차이가 있어 발생하는 문제인지 파악하지 못했습니다.

<br/>

## 월간 캘린더, 주간 캘린더

calendarScreen 내부에서 플래그를 통해 두 캘린더를 구현하려고 하니 복잡성이 커지고, 제스처 핸들러와 scroll view 좌우 스와이프가 겹쳐 정상적으로 동작하지 않는 문제가 발생했습니다. 

주간, 월간 컴포넌트를 분리하고, CalendarScreen에서 상하 스와이프에 따른 mode 플래그를 설정하여 컴포넌트를 렌더링 하는 구조로 변경했습니다. [Weekly](#1097b60a8ecb08d1437070b2862c85eee6584b2a)
[Monthly](#9b7065dc7b2aa1c5cc5a8d27cbee73c64ae3a4b3)

하지만 **react native reanimated**의 sharedValue를 통해 플래그를 사용할 수 없었습니다. 기본적인 자바스크립트와 다르게 동작하기 때문에 값이 변한다고 렌더링이 일어나지 않았습니다. 

reanimated에서 상태를 변경할 수 있는 방법을 찾는다면 주간과 월간을 변경하는데 문제가 없을 것 같습니다.

### 주간 캘린더 날짜 매핑

월간 캘린더와 마찬가지로 마지막과 처음에 도달했을 때 새로운 날짜를 붙이고 인덱스를 중간에 위치시켜주도록 설계했습니다. 

다만 인덱스를 맞추기 위해 달 전체 이외에 앞 뒤로 2주씩 받아 인덱스를 14로 맞춰주었습니다.

https://user-images.githubusercontent.com/63990725/200419094-b5016938-8349-4770-9f67-ad6783506be5.mp4





