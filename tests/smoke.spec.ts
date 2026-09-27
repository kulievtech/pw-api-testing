import { expect } from "../utils/custom-expect";
import { test } from "../utils/fixtures";
import { faker } from "@faker-js/faker";

test.describe("Conduit API suite", () => {
  let authToken: string;

  test.beforeAll("Run before all tests", async ({ api, config }) => {
    const loginResponse = await api
      .path("/users/login")
      .body({
        user: {
          email: config.userEmail,
          password: config.userPassword,
        },
      })
      .postRequest(200);

    authToken = `Token ${loginResponse.user.token}`;
  });

  test("Get All Articles", async ({ api }) => {
    const response = await api
      .path("/articles")
      .params({ limit: "10", offset: "0" })
      .getRequest(200);

    expect(response.articles.length).shouldBeLessThanOrEqual(10);
    expect(response.articlesCount).shouldEqual(10);
  });

  test("Get Test Tags", async ({ api }) => {
    const response = await api.path("/tags").getRequest(200);

    expect(response.tags[0]).shouldEqual("Test");
    expect(response.tags.length).shouldBeLessThanOrEqual(10);
  });

  test("Create and Delete Article", async ({ api }) => {
    // Generate random article data using faker
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

    // Create a new article
    const newArticleResponse = await api
      .path("/articles")
      .headers({ Authorization: authToken })
      .body(articleData)
      .postRequest(201);

    const articleSlug = newArticleResponse.article.slug;

    expect(newArticleResponse.article.title).shouldEqual(articleTitle);
    expect(newArticleResponse.article.description).shouldEqual(
      articleDescription,
    );
    expect(newArticleResponse.article.body).shouldEqual(articleBody);

    const expectedTags = articleTags.map((tag) => tag.toLowerCase()).sort();

    const actualTags = newArticleResponse.article.tagList
      .map((tag: string) => tag.toLowerCase())
      .sort();

    expect(actualTags).shouldEqual(expectedTags);

    // Delete the created article
    await api
      .path(`/articles/${articleSlug}`)
      .headers({ Authorization: authToken })
      .deleteRequest(204);
  });

  test("Create, Update, and Delete Article", async ({ api }) => {
    // Generate random article data using faker
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

    // Create a new article
    const newArticleResponse = await api
      .path("/articles")
      .headers({ Authorization: authToken })
      .body(articleData)
      .postRequest(201);

    const articleSlug = newArticleResponse.article.slug;

    expect(newArticleResponse.article.title).shouldEqual(articleTitle);
    expect(newArticleResponse.article.description).shouldEqual(
      articleDescription,
    );
    expect(newArticleResponse.article.body).shouldEqual(articleBody);

    const expectedTags = articleTags.map((tag) => tag.toLowerCase()).sort();

    const actualTags = newArticleResponse.article.tagList
      .map((tag: string) => tag.toLowerCase())
      .sort();

    expect(actualTags).shouldEqual(expectedTags);

    // Update the created article
    const updatedArticleData = {
      article: {
        title: faker.lorem.words(4),
        description: faker.lorem.sentence(),
        body: faker.lorem.paragraph(),
        tagList: [faker.lorem.word(), faker.lorem.word()],
      },
    };

    const updatedArticleResponse = await api
      .path(`/articles/${articleSlug}`)
      .headers({ Authorization: authToken })
      .body(updatedArticleData)
      .putRequest(200);

    const updatedArticleSlug = updatedArticleResponse.article.slug;

    expect(updatedArticleResponse.article.title).shouldEqual(
      updatedArticleData.article.title,
    );
    expect(updatedArticleResponse.article.description).shouldEqual(
      updatedArticleData.article.description,
    );
    expect(updatedArticleResponse.article.body).shouldEqual(
      updatedArticleData.article.body,
    );

    const expectedUpdatedTags = updatedArticleData.article.tagList
      .map((tag) => tag.toLowerCase())
      .sort();

    const actualUpdatedTags = updatedArticleResponse.article.tagList
      .map((tag: string) => tag.toLowerCase())
      .sort();

    expect(actualUpdatedTags).shouldEqual(expectedUpdatedTags);

    // Delete the updated article
    await api
      .path(`/articles/${updatedArticleSlug}`)
      .headers({ Authorization: authToken })
      .deleteRequest(204);
  });
});
