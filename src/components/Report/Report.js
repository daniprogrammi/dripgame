import {useState, useContext, useEffect} from 'react';
import { TextInput, Checkbox, Button, Group, Box } from '@mantine/core';
import {useForm} from '@mantine/form';
import createImageReport from '../../services/createImageReport';

function ReportForm({imageUrl, user}) {
    const form = useForm({
        initialValues: {
            reportingUser: user,
            imageUrl: imageUrl,
            reportReason: '',
            otherOwner: ''
        },

        validate: {
            reportReason: (value) => {
                if (value.length > 30) {
                    if (value.length < 500){
                        return null;
                    }
                    else {
                        return 'We can only read so much... please';
                    }
                }
                else {
                    return 'Reason must be greater than 30 characters long';
                }
            }
        }
    });

    const submitForm = async (values) => {
        console.log(values);
        await createImageReport(values.reportingUser, values.imageUrl, values.reportReason, values.otherOwner);
    }

    return (<Box maw={300} mx="auto">
      <form onSubmit={form.onSubmit((values) => submitForm(values))}>
        <TextInput
          withAsterisk
          label="Reason for reporting"
          placeholder="Please state why this image should be removed from the site"
          {...form.getInputProps('reportReason')}
        />

        <Checkbox
          mt="md"
          label="Another person owns this image"
          {...form.getInputProps('otherOwner', { type: 'checkbox' })}
        />

        <Group position="right" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Box>);
}

export default function Report({imageUrl, user}){
    return (<ReportForm imageUrl={imageUrl} user={user}/>)
}