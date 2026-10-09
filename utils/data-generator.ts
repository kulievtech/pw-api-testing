import { faker } from "@faker-js/faker";

type ArticleData = {
  article: {
    title: string;
    description: string;
    body: string;
    tagList: string[];
  };
};

function getRandomArticle(): ArticleData {
  const articleTitle = faker.lorem.words(3);
  const articleDescription = faker.lorem.sentence();
  const articleBody = faker.lorem.paragraph();
  const articleTags = [faker.lorem.word(), faker.lorem.word()];

  const articleData = {
    article: {
      title: articleTitle,
      description: articleDescription,
      body: articleBody,
      tagList: articleTags,
    },
  };

  return articleData;
}

function updateArticleData(): ArticleData {
  const updatedArticleData = {
    article: {
      title: faker.lorem.words(4),
      description: faker.lorem.sentence(),
      body: faker.lorem.paragraph(),
      tagList: [faker.lorem.word(), faker.lorem.word()],
    },
  };

  return updatedArticleData;
}

export { getRandomArticle, updateArticleData };
