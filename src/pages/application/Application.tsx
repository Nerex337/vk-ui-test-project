import {
  type CustomSelectOptionInterface,
  FormLayoutGroup,
  Panel,
  PanelHeader,
  Box,
  Title,
  Headline,
  Group,
  FormItem,
  Input,
  Select,
  Textarea,
  Checkbox,
  Button,
  Banner,
  Link,
  Avatar,
  Snackbar,
  SimpleGrid,
} from "@vkontakte/vkui";
import { useState } from "react";
import { Icon12ErrorCircleFillYellow, Icon16Done } from "@vkontakte/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getProjectDictionaryGetProjectTypes,
  postProjectApplicationExternalApplicationCreateExternalProjectApplication,
} from "../../client/sdk.gen";
import type { CreateExternalApplicationModel } from "../../client";
import styles from "./Application.module.css";

export const Application = () => {
  const [isAgreed, setIsAgreed] = useState(false);
  const [snackbar, setSnackbar] = useState<React.ReactNode | null>(null);
  const initialFormData = {
    fullName: "",
    email: "",
    phone: "",
    organisationName: "",
    organisationUrl: "",
    projectName: "",
    typeId: 0,
    expectedResults: "",
    isPayed: false,
    additionalInformation: "",
  };
  const [formData, setFormData] =
    useState<CreateExternalApplicationModel>(initialFormData);

  const showSnackbar = () => {
    if (snackbar) return;
    setSnackbar(
      <Snackbar
        onClose={() => setSnackbar(null)}
        before={
          <Avatar
            size={24}
            style={{ background: "var(--vkui--color_background_accent)" }}
          >
            <Icon16Done fill="#fff" width={14} height={14} />
          </Avatar>
        }
      >
        Заявка успешно отправлена
      </Snackbar>,
    );
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    if (name === "typeId") {
      setFormData((prev) => ({ ...prev, typeId: Number(value) }));
    } else if (name === "isPayed") {
      setFormData((prev) => ({
        ...prev,
        isPayed: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const { data: types } = useQuery({
    queryKey: ["project-types"],
    queryFn: () => getProjectDictionaryGetProjectTypes(),
    select: (res) => res.data,
  });

  const queryClient = useQueryClient();

  const createApplication = useMutation({
    mutationFn: () =>
      postProjectApplicationExternalApplicationCreateExternalProjectApplication(
        {
          body: formData,
        },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["external-applications"] });
      showSnackbar();
      setFormData(initialFormData);
      setIsAgreed(false);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createApplication.mutate();
  };

  return (
    <Panel id="application">
      <PanelHeader>Заявка на проект для внешнего инициатора</PanelHeader>
      <FormLayoutGroup className={styles.container}>
        <form onSubmit={handleSubmit}>
          <Box paddingInline="2xl">
            <Title level="1">Контактная информация</Title>
            <Headline>
              Предоставьте информацию о ваших контактах для дальнейшей
              оперативной связи
            </Headline>
          </Box>
          <Group mode="plain">
            <FormItem
              required
              top={
                <FormItem.Top>
                  <FormItem.TopLabel htmlFor="fullName">ФИО</FormItem.TopLabel>
                  <FormItem.TopAside>
                    {formData?.fullName?.length}/150
                  </FormItem.TopAside>
                </FormItem.Top>
              }
            >
              <Input
                required
                name="fullName"
                value={formData?.fullName}
                onChange={handleChange}
                placeholder="Введите ФИО"
                maxLength={150}
              />
            </FormItem>
            <SimpleGrid columns={2}>
              <FormItem
                required
                top={
                  <FormItem.Top>
                    <FormItem.TopLabel htmlFor="email">Почта</FormItem.TopLabel>
                    <FormItem.TopAside>
                      {formData?.email?.length}/150
                    </FormItem.TopAside>
                  </FormItem.Top>
                }
              >
                <Input
                  required
                  name="email"
                  value={formData?.email}
                  onChange={handleChange}
                  placeholder="Введите почту"
                  maxLength={150}
                />
              </FormItem>
              <FormItem top="Телефон">
                <Input
                  name="phone"
                  value={formData?.phone || ""}
                  onChange={handleChange}
                  placeholder="+7 (___) ___-__-__"
                  type="tel"
                  pattern="\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}"
                />
              </FormItem>
            </SimpleGrid>
            <SimpleGrid columns={2}>
              <FormItem
                required
                top={
                  <FormItem.Top>
                    <FormItem.TopLabel htmlFor="organisationName">
                      Название организации
                    </FormItem.TopLabel>
                    <FormItem.TopAside>
                      {formData?.organisationName?.length}/150
                    </FormItem.TopAside>
                  </FormItem.Top>
                }
              >
                <Input
                  required
                  name="organisationName"
                  value={formData?.organisationName || ""}
                  onChange={handleChange}
                  placeholder="Введите название организации"
                  maxLength={150}
                />
              </FormItem>
              <FormItem top="Ссылка на сайт организации">
                <Input
                  name="organisationUrl"
                  value={formData?.organisationUrl || ""}
                  onChange={handleChange}
                  placeholder="Введите ссылку на сайт организации"
                />
              </FormItem>
            </SimpleGrid>
          </Group>
          <Box paddingInline="2xl">
            <Title level="1">Общая информация</Title>
            <Headline>
              Выбор названия и типа проекта будет определять его направление
              деятельности
            </Headline>
          </Box>
          <Group mode="plain">
            <FormItem
              required
              top={
                <FormItem.Top>
                  <FormItem.TopLabel htmlFor="projectName">
                    Название проекта
                  </FormItem.TopLabel>
                  <FormItem.TopAside>
                    {formData.projectName.length}/150
                  </FormItem.TopAside>
                </FormItem.Top>
              }
            >
              <Input
                required
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                placeholder="Введите название проекта"
                maxLength={150}
              />
            </FormItem>
            <FormItem required top="Тип проекта">
              <Select
                required
                name="typeId"
                options={
                  (types?.map(({ id, name }) => ({
                    value: String(id),
                    label: name,
                  })) as CustomSelectOptionInterface[]) || []
                }
                value={formData?.typeId ? String(formData.typeId) : null}
                onChange={handleChange}
                placeholder="Тип проекта"
              />
            </FormItem>
            <FormItem
              required
              top={
                <FormItem.Top>
                  <FormItem.TopLabel htmlFor="expectedResults">
                    Ожидаемые результаты
                  </FormItem.TopLabel>
                  <FormItem.TopAside>
                    {formData?.expectedResults?.length}/1500
                  </FormItem.TopAside>
                </FormItem.Top>
              }
            >
              <Textarea
                required
                name="expectedResults"
                value={formData?.expectedResults || ""}
                onChange={handleChange}
                placeholder="Введите ожидаемые результаты"
                maxLength={1500}
              />
            </FormItem>
            <FormItem top="Оплата работы участников">
              <Checkbox
                name="isPayed"
                checked={formData.isPayed}
                onChange={handleChange}
              >
                Оплачиваемый
              </Checkbox>
            </FormItem>
            <FormItem
              top={
                <FormItem.Top>
                  <FormItem.TopLabel htmlFor="additionalInformation">
                    Комментарий
                  </FormItem.TopLabel>
                  <FormItem.TopAside>
                    {formData?.additionalInformation?.length}/1500
                  </FormItem.TopAside>
                </FormItem.Top>
              }
            >
              <Textarea
                name="additionalInformation"
                value={formData?.additionalInformation || ""}
                onChange={handleChange}
                placeholder="Введите комментарий для Проектного офиса"
                maxLength={1500}
              />
            </FormItem>
            <Box paddingInline="2xl">
              <Banner
                before={<Icon12ErrorCircleFillYellow width={24} height={24} />}
                title="Предоставьте письмо заинтересованности организации в проекте в
            Проектный офис МИЭМ НИУ ВШЭ по почте miem.projects@hse.ru. По
            завершении проекта Вам понадобится предоставить отзыв
            организации-заказчика на проект"
              />
            </Box>
          </Group>
          <FormItem>
            <Checkbox
              name="isAgreed"
              checked={isAgreed}
              onChange={(e) => setIsAgreed(e.target.checked)}
            >
              Я подтверждаю, что лично ознакомился с{" "}
              <Link href="https://www.hse.ru/data_protection_regulation">
                Положением об обработке персональных данных НИУ ВШЭ
              </Link>
              , вправе предоставлять свои персональные данные и давать согласие
              на их обработку.
            </Checkbox>
          </FormItem>
          <Box paddingInline="2xl" paddingBlockEnd="2xl">
            <Button type="submit" disabled={!isAgreed} size="l">
              Отправить заявку
            </Button>
          </Box>
        </form>
        {snackbar}
      </FormLayoutGroup>
    </Panel>
  );
};
