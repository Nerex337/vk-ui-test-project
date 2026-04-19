import {
  Panel,
  PanelHeader,
  Group,
  Header,
  Tabs,
  TabsItem,
  Search,
  RichCell,
  Avatar,
  Spacing,
  CellButton,
  Popover,
  Box,
  Footnote,
  SimpleCell,
  Flex,
  SimpleGrid,
  RadioGroup,
  Radio,
  Text,
  Spinner,
} from "@vkontakte/vkui";
import {
  Icon24Filter,
  Icon32UserCircleFillBlue,
  Icon32UsersCircleFillBlue,
} from "@vkontakte/icons";
import {
  getProjectApplicationExternalApplicationGetExternalApplications,
  getProjectDictionaryGetProjectTypes,
} from "../../client/sdk.gen";
import type { ExternalApplicationStatus } from "../../client";
import { EXTERNAL_APPLICATION_STATUS_TO_NAME } from "../../shared/consts/application";
import { useFilters } from "../../shared/hooks/useFilters";
import { useQuery } from "@tanstack/react-query";
import styles from "./External.module.css";
import { APPLICATION_PLURALS, pluralize } from "../../shared/util/pluralize";

export const External = () => {
  const { filters, updateFilters, clearFilters } = useFilters();

  const { data: applicationsData, isLoading } = useQuery({
    queryKey: ["external-applications", filters],
    queryFn: () =>
      getProjectApplicationExternalApplicationGetExternalApplications({
        query: {
          active: true,
          search: filters.search,
          projectTypeId: filters.type ? Number(filters.type) : undefined,
          status: filters.status
            ? (filters.status as ExternalApplicationStatus)
            : undefined,
          sortByDateUpdated: "DESC",
        },
      }),
    select: (res) => res.data,
  });

  const { data: types } = useQuery({
    queryKey: ["project-types"],
    queryFn: () => getProjectDictionaryGetProjectTypes(),
    select: (res) => res.data,
  });

  return (
    <Panel id="external">
      <PanelHeader>Внешние заявки</PanelHeader>
      <Box paddingInline="2xl">
        <Tabs>
          <TabsItem id="active-tab" aria-controls="active" selected>
            Активные
          </TabsItem>
          <TabsItem id="archive-tab" aria-controls="archive">
            Архивные
          </TabsItem>
        </Tabs>
        <Spacing size="m" />
        <Group>
          <Flex noWrap align="center" paddingInlineEnd="2xl">
            <Search
              placeholder="Введите номер, название, заказчика или ФИО инициатора проекта"
              value={filters.search}
              onChange={(e) => updateFilters("search", e.target.value)}
              icon={(renderButton) => (
                <Popover
                  content={({ onClose }) => (
                    <Box paddingInline="2xl" paddingBlockEnd="2xl">
                      <Group
                        header={<Header>Статус проекта</Header>}
                        mode="plain"
                      >
                        <RadioGroup>
                          {Object.entries(
                            EXTERNAL_APPLICATION_STATUS_TO_NAME,
                          ).map(([key, value]) => (
                            <Radio
                              checked={filters.status === key}
                              onChange={() => updateFilters("status", key)}
                              key={key}
                              name="status"
                              value={key}
                            >
                              {value}
                            </Radio>
                          ))}
                        </RadioGroup>
                      </Group>

                      <Group header={<Header>Тип проекта</Header>} mode="plain">
                        <RadioGroup>
                          {types?.map(({ id, name }) => (
                            <Radio
                              checked={filters.type === String(id)}
                              onChange={() => updateFilters("type", id)}
                              key={id}
                              name="type"
                              value={id}
                            >
                              {name}
                            </Radio>
                          ))}
                        </RadioGroup>
                      </Group>

                      <CellButton
                        onClick={() => {
                          onClose();
                          clearFilters();
                        }}
                      >
                        Сбросить фильтры
                      </CellButton>
                    </Box>
                  )}
                >
                  {renderButton(<Icon24Filter />, { "aria-label": "Фильтры" })}
                </Popover>
              )}
            />
            <Text
              className={styles.text}
            >{`${applicationsData?.count || "..."} ${pluralize(applicationsData?.count || 0, APPLICATION_PLURALS)}`}</Text>
          </Flex>
        </Group>

        {isLoading ? (
          <Spinner />
        ) : (
          applicationsData?.applications?.map((application, i) => (
            <Group key={i}>
              <RichCell
                key={i}
                multiline
                before={
                  <Avatar
                    gradientColor={5}
                    slotProps={{
                      img: {
                        style: {
                          objectFit: "contain",
                          padding: "6px",
                          boxSizing: "border-box",
                        },
                      },
                    }}
                    src={application.typeLogoSrc}
                  />
                }
                after={
                  <Box>
                    <Footnote weight="1">
                      {EXTERNAL_APPLICATION_STATUS_TO_NAME[application.status]}
                    </Footnote>
                    <Footnote weight="3">
                      {new Date(application.dateUpdated).toLocaleDateString(
                        "ru-RU",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        },
                      )}
                    </Footnote>
                  </Box>
                }
                contentAlign="end"
                bottom={
                  <SimpleGrid columns={4}>
                    <SimpleCell
                      multiline
                      before={
                        <Avatar size={40}>
                          <Icon32UsersCircleFillBlue width={40} height={40} />
                        </Avatar>
                      }
                      subtitle="заказчик проекта"
                    >
                      {application.organisationName}
                    </SimpleCell>
                    <SimpleCell
                      multiline
                      before={
                        <Avatar size={40}>
                          <Icon32UserCircleFillBlue width={40} height={40} />
                        </Avatar>
                      }
                      subtitle="инициатор"
                    >
                      {application.initiator}
                    </SimpleCell>
                    {application.managerId && (
                      <SimpleCell
                        multiline
                        before={
                          <Avatar
                            src={
                              application.managerAvatarSrc
                                ? application.managerAvatarSrc
                                : ""
                            }
                            size={40}
                          >
                            {!application.managerAvatarSrc && (
                              <Icon32UserCircleFillBlue
                                width={40}
                                height={40}
                              />
                            )}
                          </Avatar>
                        }
                        subtitle="руководитель проекта"
                      >
                        {application.managerFullName}
                      </SimpleCell>
                    )}
                    {application.directionManagerId && (
                      <SimpleCell
                        multiline
                        before={
                          <Avatar
                            src={
                              application.directionManagerAvatarSrc
                                ? application.directionManagerAvatarSrc
                                : ""
                            }
                            size={40}
                          >
                            {!application.directionManagerAvatarSrc && (
                              <Icon32UserCircleFillBlue
                                width={40}
                                height={40}
                              />
                            )}
                          </Avatar>
                        }
                        subtitle="руководитель направления"
                      >
                        {application.directionManagerFullName}
                      </SimpleCell>
                    )}
                  </SimpleGrid>
                }
              >
                {application.projectName}
              </RichCell>
            </Group>
          ))
        )}
      </Box>
    </Panel>
  );
};
