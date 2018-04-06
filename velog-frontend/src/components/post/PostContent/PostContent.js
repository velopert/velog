// @flow
import React from 'react';
import Responsive from 'components/common/Responsive';
import MarkdownRender from 'components/common/MarkdownRender';
import './PostContent.scss';

type Props = { }

const sampleMarkdown = `
# Elasticsearch, Lambda 와 Serverless 프레임워크를 통한 검색엔진 구현 @ Laftel

## 서론

[라프텔](https://laftel.net) 에서 기존에 사용하던 검색기능은 PostgreSQL 데이터베이스에서 그냥 SQL 기반으로 구현되어 있었다. 뭔가, 최적화된 SQL 을 우리가 직접 작성한것은 아니였고, Django 가 빌드해준 쿼리를 사용중이였기에, 성능이 썩 좋지는 않았다. 이 검색 기능은 검색 기능은 사실 작년까지만해도 별 탈은 없었는데, 유저가 급증함에 따라 검색 API 가 데이터베이스 부하를 일으키게 되어서 우리는 검색 옵션 중 몇가지를 해제했었다 예를 들어, 제작사 검색 같은 것들. 제작사 검색을 하는 유저들은 그렇게 많지는 않은데, 되던게 안되니까 문의를 주는 유저들도 꽤 있었다. 

그래서 우리는 Elasticsearch 를 통해서 좀 제대로 된, 높은 성능을 지닌 검색엔진을 구축하기로 계획을 했고, 지난 2월 말에 내가 이 작업을 맡아서 진행하게 됐었다. 그런데 나는 사실 Elasticsearch 에 대해서는 작년에 잠깐 검색해보고 로컬에서 조금 테스트 해본게 전부라서 제대로 알지는 못했다. 그래도, 재밌어보여서 일단 맨땅에 헤딩을 하기로 했다.

처음 사용해보니 기술이다보니, 당연하게도 삽질을 정말 많이했다. 서버리스 관련 기술 또한 요즘 자주 사용하고 있긴 하지만 여러 방면으로 응용한 경험은 그렇게 많지 않아서, 서버리스 관련해서도 삽질을 꽤 했었다.

이 포스트에서는, 그 동안 삽질하면서 내가 배운 내용들, 그리고 봤던 자료들을 정리해보려 한다.

## 서버 설정

우리 회사가 빅데이터를 다루는 기업이지만, 사용자의 평가 데이터가 빅데이터지 작품들의 데이터는 결코 빅데이터는 아니다. 저번에 파일 용량으로 따졌을때 작품 정보만 따로 분류해본 경우 용량이 그렇게 많지는 않았다. 

물론 사용자의 평가 기록과 사용 기록 같은것도 제대로 수집해서 여러방면으로 시각화하면서 분석할 수 있다면 좋겠지만, 일단 난 거기까지 생각하진 않았다. 일단 지금 집중하고 싶은 부분은 단순히 검색엔진 기능이다.

AWS에서 Elasticsearch Service 를 제공하긴 하지만 뭔가 세부적으로 커스터마이징을 제대로 할 자신이 없고, 비용적인 측면에서는 EC2 를 사용하는 것 보다 더 나오겠다 싶어서 EC2 에 직접 설치하기로 했다.

Elastic 에서 제공하는 블로그 포스트 중에서 [AWS에서 Elasticsearch 실행하기](https://aws.amazon.com/ko/elasticsearch-service/) 라는 글이 있는데 거기서 보면 이런 말이 있다.

> 시작하기에 적당한 인스턴스 유형은 vCPU 8개, 30 GiB 메모리, 80 GB SSD 드라이브 2개를 제공하고 고성능 네트워크가 제공되는 m3.2xlarge입니다. 

지금은 해당 EC2 타입은 더이상 없고 비슷한 스펙의 m4.2xlarge 의 경우엔 한국서버 기준으로 시간당 $0.984 정도 한다. 0.984 * 24 * 30 = 708.48 이니까 대략 한달에 75만원 정도 한다는 건데, 우리가 막 사용자 사용 기록 같은걸 시각화 하면서 분석하고 싶다면 저건 유의미 하겠지만 단순히 검색 기능 때문에 없던 지출 한달 75만 하기에는 뭔가 엄청난 낭비라고 생각했다.

우리가 들고 있는 작품 데이터는 그렇게 양이 엄청나지는 않으니까, 그리고 지금은 검색엔진 개발 단계니까, t2.micro 를 써보자! 라고 생각했다. 당연한 얘기지만 사양이 너무 부족했다. 최소 램이 2G 는 되야한다. 그래서 일단 개발 단계에서는 t2.small 을 사용하기로 했다. 프로덕션에 올리기 전에는 아마 t2.medium 으로 올리게 될 것 같고 수요에 따라 노드를 여러개 만들 예정이다.

t2.small 에 검색엔진을 구현하게 될 때 필요한 ELK 스택을 설치하기 위해서, [Install and configure the ELK stack on Ubuntu 16.04](https://www.rosehosting.com/blog/install-and-configure-the-elk-stack-on-ubuntu-16-04/) 포스트를 참고했다. Elasticsearch 버전은 5.6.7로 설치됐다.

그리고, 서버 성능이 아직은 좀 낮은 편이니, Elasticsearch 에서 메모리 제한을 낮춰줘야 제대로 작동했다. 해당 내용은 [Setting the heap size](https://www.elastic.co/guide/en/elasticsearch/reference/current/heap-size.html) 에서 확인 할 수 있다.

## ELK 스택

ELK 스택이 뭔지 모르는 사람을 위해 설명을 좀 남겨보자면 다음과 같다:

- Elasticsearch
- Logstash
- Kibana

Elasticsearch 는 일단 검색엔진 시스템이고, Kibana 는 브라우저를 통해 Elasticsearch 에 있는 데이터를 여러 방면으로 조회 할수 있게 해주는 도구이다. Google Analytics 랑 은근히 비슷하다고 생각하면 되겠다. 하지만 더 높은 방면으로 활용이 가능하다.

이 두가지는, 작년에도 테스팅을 해봐서 어떤 역할인지 잘 이해를 했는데, LogStash 는 이번에 사용해보면서 왜 써야 하는지 깨닫게 됐었다. 만약에 무시했으면 큰일 날 뻔했다.

LogStash 는 로그수집 도구이다. 나는 PostgreSQL 데이터베이스에 있는 데이터를 가지고 검색을 해야 하는 것 이기에, 이거랑 로그랑 관련 없을거라고 생각했다. 작년에 잠깐 Elasticsearch 관련해서 테스트를 해볼 때, 데이터들을 수집하기 위해선 SQL 로 CSV 나 JSON으로 뽑아와서 Elasticsearch 의 Bulk API 를 통해서 등록해야 하는 줄 알았다.

아니 맞는 말이긴 한데, 이걸 모두 직접 코드로 작성해야 하는 줄 알았다. 그래서 작년에 했었던 작업이, Node.js 로 스크립트 작성해서 SQL 로 데이터 긁어오고, 근데 한꺼번에 불러오면 서버 힘들테니까 페이지네이션 구현해서 긁어온다음에 Elasticsearch 에 등록을 했었다. 뭐 별로 복잡한 코드까진 아니였는데 은근히 비효율적이였다. 

그런데 이번에 알고보니까, 우리가 다루는 데이터가 **로그** 가 아니더라 하더라도, LogStash 는 매우 유용하게 사용 할 수 있었다. Logstash 를 사용하면, 그냥 단순히 .conf 파일에 DB 서버 접속 정보 설정하고, 긁어오고 싶은 데이터를 불러오는 SQL과 Elasticsearch 의 어떤 인덱스에 데이터를 넣어줄지만 정해주고 실행하면, 알아서 데이터 가져와서 Elasticsearch 에 등록해준다.

해당 부분은 [INSERT INTO LOGSTASH SELECT DATA FROM DATABASE](https://www.elastic.co/blog/logstash-jdbc-input-plugin) 

다음은 내가 데이터베이스에서 긁어와서 Elasticsearch 에 등록 할 때 사용했던 예제 conf 파일이다:

\`\`\`conf
input {
    jdbc {
        # DB 접속정보
        jdbc_connection_string => "jdbc:postgresql://<host>:5432/<databaseName>"
        jdbc_user => "<user>"
        jdbc_password => "<pass>"
        # PostgreSQL jdbc 드라이버 받아줘야함
        jdbc_driver_library => "/opt/postgresql-42.2.1.jar"
        # The name of the driver class for Postgresql
        jdbc_driver_class => "org.postgresql.Driver"
        # 끊어서 불러오는 기능 활성화
        jdbc_paging_enabled => "true"
        # 1000 개씩 끊어서 불러와줌
        jdbc_page_size => "1000"
        # schedule => "0 6 * * *" # 이 부분을 주석 풀어주면 매일 아침 6시마다 동기화 진행

        statement => "SELECT * FROM somewhere" # 딱히 여기에 Limit 이라던지 그런거 안해도 됨 
        # 자동으로 1000 개씩 끊어서 순서대로 쿼리
    }
}
output {
  # 받아온것들을 elasticsearch 에 등록한다.
  elasticsearch {
    # 예: index: items, document_type: animation
    index => "<index>"
    document_type => "<type>"
    document_id => "%{id}" # 고유 ID 로 사용할 깂
    hosts => ["localhost:9200"]
  }
}
\`\`\`

## ELK Stack 설치

- https://www.rosehosting.com/blog/install-and-configure-the-elk-stack-on-ubuntu-16-04/

 
`;

const PostContent = (props: Props) => (
  <div className="PostContent">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 10" preserveAspectRatio="none">
      <polygon points="0 0, 100 0, 0 10" fill="#ffffff" />
    </svg>
    <div className="wrapper">
      <Responsive className="floating-box" style={{ maxWidth: '980px' }}>
        <MarkdownRender body={sampleMarkdown} />
      </Responsive>
    </div>
  </div>
);

export default PostContent;